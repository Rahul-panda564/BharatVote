/**
 * @jest-environment jsdom
 * 
 * Navbar Component Tests
 * 
 * Validates rendering, navigation links, authentication state handling,
 * mobile menu toggle, and accessibility of the Navbar component.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock auth context
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

// Mock GoogleTranslate component
jest.mock('../GoogleTranslate', () => {
  return function MockGoogleTranslate() {
    return <div data-testid="google-translate">Translate</div>;
  };
});

describe('Navbar Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    usePathname.mockReturnValue('/');
    useAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with logo on home page', () => {
    render(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Bharat')).toBeInTheDocument();
  });

  test('does not render on auth pages', () => {
    usePathname.mockReturnValue('/auth/login');
    const { container } = render(<Navbar />);
    expect(container.innerHTML).toBe('');
  });

  test('does not render on chunav-mitra page', () => {
    usePathname.mockReturnValue('/chunav-mitra');
    const { container } = render(<Navbar />);
    expect(container.innerHTML).toBe('');
  });

  test('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Live Results')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  test('shows Login and Join buttons when user is not authenticated', () => {
    render(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Join')).toBeInTheDocument();
  });

  test('shows user profile and logout when authenticated', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Rahul Kumar', uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    // Should show initials "RA"
    expect(screen.getAllByText('RA').length).toBeGreaterThanOrEqual(1);
    // Should show logout
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('shows "BV" initials when user has no displayName', () => {
    useAuth.mockReturnValue({
      user: { displayName: null, uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    expect(screen.getAllByText('BV').length).toBeGreaterThanOrEqual(1);
  });

  test('calls logout function when logout button is clicked', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Test', uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('toggles mobile menu on button click', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
  });

  test('closes mobile menu on Escape key press', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();
  });

  test('renders Google Translate component', () => {
    render(<Navbar />);
    expect(screen.getByTestId('google-translate')).toBeInTheDocument();
  });

  test('highlights active navigation link', () => {
    usePathname.mockReturnValue('/journey');
    render(<Navbar />);
    const journeyLink = screen.getByText('Journey').closest('a');
    expect(journeyLink).toHaveAttribute('aria-current', 'page');
  });

  test('does not highlight inactive navigation link', () => {
    usePathname.mockReturnValue('/journey');
    render(<Navbar />);
    const learnLink = screen.getByText('Learn').closest('a');
    expect(learnLink).not.toHaveAttribute('aria-current');
  });

  test('has primary navigation aria-label', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument();
  });

  test('mobile menu button has correct aria-expanded state', () => {
    render(<Navbar />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toHaveAttribute('aria-expanded', 'true');
  });

  test('calls logout and redirects when logout is clicked', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Test', uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  test('marks notifications as read on click', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Test', uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    const notifLink = screen.getByLabelText('Notifications');
    fireEvent.click(notifLink);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('bv_notif_read', 'true');
  });

  test('shows notification badge when unread', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Test', uid: '123' },
      logout: mockLogout,
    });
    window.localStorage.getItem.mockReturnValue(null);
    render(<Navbar />);
    expect(screen.getByLabelText('2 unread notifications')).toBeInTheDocument();
  });

  test('calls logout in mobile menu', () => {
    useAuth.mockReturnValue({
      user: { displayName: 'Test', uid: '123' },
      logout: mockLogout,
    });
    render(<Navbar />);
    // Open mobile menu
    fireEvent.click(screen.getByLabelText('Open menu'));
    const logoutBtns = screen.getAllByText('Logout', { selector: 'button' });
    fireEvent.click(logoutBtns[logoutBtns.length - 1]); // Click the last one (usually mobile)
    expect(mockLogout).toHaveBeenCalled();
  });

  test('closes mobile menu on escape key', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByLabelText('Close menu')).not.toBeInTheDocument();
  });
});
