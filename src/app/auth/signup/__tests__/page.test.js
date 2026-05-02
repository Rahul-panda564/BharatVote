/**
 * @jest-environment jsdom
 * 
 * Signup Page Tests
 * 
 * Validates form rendering, input handling, password validation,
 * error display, and accessibility of the Signup page.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '../page';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/auth/signup'),
}));

// Mock auth context
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

describe('Signup Page', () => {
  const mockPush = jest.fn();
  const mockSignup = jest.fn();
  const mockGoogleSignIn = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    useAuth.mockReturnValue({
      signup: mockSignup,
      googleSignIn: mockGoogleSignIn,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup page with heading', () => {
    render(<SignupPage />);
    expect(screen.getByText('Join the Movement')).toBeInTheDocument();
    expect(screen.getByText('Create your account to start your journey')).toBeInTheDocument();
  });

  test('renders all form fields', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm/i)).toBeInTheDocument();
  });

  test('renders register button', () => {
    render(<SignupPage />);
    expect(screen.getByRole('button', { name: /Register Now/i })).toBeInTheDocument();
  });

  test('renders Google sign-in button', () => {
    render(<SignupPage />);
    expect(screen.getByText('Google Account')).toBeInTheDocument();
  });

  test('renders link to login page', () => {
    render(<SignupPage />);
    expect(screen.getByText('Login here')).toBeInTheDocument();
    expect(screen.getByText('Login here').closest('a')).toHaveAttribute('href', '/auth/login');
  });

  test('shows error when passwords do not match', async () => {
    render(<SignupPage />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'different456' } });
    fireEvent.submit(screen.getByRole('button', { name: /Register Now/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
    expect(mockSignup).not.toHaveBeenCalled();
  });

  test('calls signup function with matching passwords', async () => {
    mockSignup.mockResolvedValueOnce({});
    render(<SignupPage />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Register Now/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });

  test('redirects to profile page on successful signup', async () => {
    mockSignup.mockResolvedValueOnce({});
    render(<SignupPage />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Register Now/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  test('shows error message on failed signup', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Email already in use'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<SignupPage />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Register Now/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create account/i)).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });

  test('shows loading state during submission', async () => {
    mockSignup.mockImplementation(() => new Promise(() => {}));
    render(<SignupPage />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Register Now/i }));

    await waitFor(() => {
      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    });
  });

  test('has required attributes on all form fields', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/Full Name/i)).toBeRequired();
    expect(screen.getByLabelText(/Email Address/i)).toBeRequired();
    expect(screen.getByLabelText(/^Password/i)).toBeRequired();
    expect(screen.getByLabelText(/Confirm/i)).toBeRequired();
  });

  test('renders mandatory field indicators', () => {
    render(<SignupPage />);
    const asterisks = screen.getAllByText('*');
    expect(asterisks.length).toBeGreaterThanOrEqual(4);
  });

  test('renders BharatVote logo link', () => {
    render(<SignupPage />);
    const logoLink = screen.getByText('Bharat').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('calls googleSignIn on button click', async () => {
    mockGoogleSignIn.mockResolvedValueOnce({});
    render(<SignupPage />);
    const googleBtn = screen.getByText('Google Account');
    fireEvent.click(googleBtn);
    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  test('toggles password visibility', () => {
    render(<SignupPage />);
    const passwordInput = screen.getByLabelText(/^Password/i);
    // Find the toggle buttons by their content
    const passToggle = screen.getAllByText('🙈')[0];
    
    expect(passwordInput.type).toBe('password');
    fireEvent.click(passToggle);
    expect(passwordInput.type).toBe('text');
    
    const eyeIcon = screen.getAllByText('👁️')[0];
    fireEvent.click(eyeIcon);
    expect(passwordInput.type).toBe('password');
  });
});
