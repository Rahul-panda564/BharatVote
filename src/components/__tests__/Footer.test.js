/**
 * @jest-environment jsdom
 * 
 * Footer Component Tests
 * 
 * Validates rendering, accessibility, link structure, and conditional visibility
 * of the Footer component used across the BharatVote application.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders footer on non-auth pages', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('does not render on auth pages', () => {
    usePathname.mockReturnValue('/auth/login');
    const { container } = render(<Footer />);
    expect(container.innerHTML).toBe('');
  });

  test('does not render on auth/signup pages', () => {
    usePathname.mockReturnValue('/auth/signup');
    const { container } = render(<Footer />);
    expect(container.innerHTML).toBe('');
  });

  test('renders brand name correctly', () => {
    render(<Footer />);
    expect(screen.getByText('Bharat')).toBeInTheDocument();
    expect(screen.getByText('Vote')).toBeInTheDocument();
  });

  test('renders brand description', () => {
    render(<Footer />);
    expect(screen.getByText(/Empowering 140 crore citizens/i)).toBeInTheDocument();
  });

  test('renders Brand Info section with correct links', () => {
    render(<Footer />);
    expect(screen.getByText('Brand Info')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Democracy Index')).toBeInTheDocument();
  });

  test('renders Quick Links section with correct links', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Electoral Search')).toBeInTheDocument();
    expect(screen.getByText('Live Results')).toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });

  test('renders Legal & Support section', () => {
    render(<Footer />);
    expect(screen.getByText('Legal & Support')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Guide')).toBeInTheDocument();
  });

  test('renders email support contact', () => {
    render(<Footer />);
    const emailLink = screen.getByText('support@bharatvote.in');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:support@bharatvote.in');
  });

  test('renders national helpline 1950', () => {
    render(<Footer />);
    expect(screen.getByText('1950')).toBeInTheDocument();
    expect(screen.getByText('National Helpline')).toBeInTheDocument();
  });

  test('displays correct copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  test('has correct accessibility structure with role and lists', () => {
    render(<Footer />);
    const lists = screen.getAllByRole('list');
    expect(lists.length).toBeGreaterThanOrEqual(3);
  });

  test('renders home link with aria-label', () => {
    render(<Footer />);
    expect(screen.getByLabelText('BharatVote Home')).toBeInTheDocument();
  });

  test('renders on various non-auth routes', () => {
    const routes = ['/', '/journey', '/learn', '/live-results', '/profile'];
    routes.forEach(route => {
      usePathname.mockReturnValue(route);
      const { container } = render(<Footer />);
      expect(container.querySelector('[role="contentinfo"]')).not.toBeNull();
    });
  });
});
