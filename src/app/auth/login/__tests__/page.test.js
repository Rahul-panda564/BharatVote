/**
 * @jest-environment jsdom
 * 
 * Login Page Tests
 * 
 * Validates form rendering, input handling, validation, error display,
 * and accessibility of the Login page.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/auth/login'),
}));

// Mock auth context
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

describe('Login Page', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  const mockGoogleSignIn = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    useAuth.mockReturnValue({
      login: mockLogin,
      googleSignIn: mockGoogleSignIn,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page with heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Log in to your account')).toBeInTheDocument();
  });

  test('renders email and password input fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
  });

  test('renders login button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /Login to BharatVote/i })).toBeInTheDocument();
  });

  test('renders Google sign-in button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Google Account')).toBeInTheDocument();
  });

  test('renders link to signup page', () => {
    render(<LoginPage />);
    expect(screen.getByText('Register Now')).toBeInTheDocument();
    expect(screen.getByText('Register Now').closest('a')).toHaveAttribute('href', '/auth/signup');
  });

  test('renders forgot password link', () => {
    render(<LoginPage />);
    expect(screen.getByText('Forgot?')).toBeInTheDocument();
  });

  test('updates email input on change', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates password input on change', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/^Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('calls login function on form submission', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Login to BharatVote/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('redirects to profile page on successful login', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Login to BharatVote/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  test('shows error message on failed login', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    // Suppress console.error in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'wrongpass' } });
    fireEvent.submit(screen.getByRole('button', { name: /Login to BharatVote/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to login/i)).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  test('shows loading state during submission', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Login to BharatVote/i }));

    await waitFor(() => {
      expect(screen.getByText('Logging in...')).toBeInTheDocument();
    });
  });

  test('has required attributes on email and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Email Address/i)).toBeRequired();
    expect(screen.getByLabelText(/^Password/i)).toBeRequired();
  });

  test('renders mandatory field indicators', () => {
    render(<LoginPage />);
    const asterisks = screen.getAllByText('*');
    expect(asterisks.length).toBeGreaterThanOrEqual(2);
  });

  test('renders BharatVote logo link', () => {
    render(<LoginPage />);
    const logoLink = screen.getByText('Bharat').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('calls googleSignIn on button click', async () => {
    mockGoogleSignIn.mockResolvedValueOnce({});
    render(<LoginPage />);
    const googleBtn = screen.getByText('Google Account');
    fireEvent.click(googleBtn);
    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  test('shows error on failed googleSignIn', async () => {
    mockGoogleSignIn.mockRejectedValueOnce(new Error('Google failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<LoginPage />);
    const googleBtn = screen.getByText('Google Account');
    fireEvent.click(googleBtn);
    await waitFor(() => {
      expect(screen.getByText('Google sign-in failed.')).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  test('toggles password visibility', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const toggleBtn = screen.getByText('🙈');
    
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByText('👁️')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('👁️'));
    expect(passwordInput.type).toBe('password');
  });
});
