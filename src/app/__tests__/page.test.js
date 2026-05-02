/**
 * @jest-environment jsdom
 * 
 * Home Page Tests
 * 
 * Validates rendering, content, navigation links, SEO structure,
 * and accessibility of the main landing page.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock auth context for Footer (child component)
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(() => ({ user: null, logout: jest.fn() })),
}));

// Mock GoogleTranslate
jest.mock('@/components/GoogleTranslate', () => {
  return function MockGoogleTranslate() {
    return <div data-testid="google-translate">Translate</div>;
  };
});

describe('Home Page', () => {
  test('renders hero section with main heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Your Vote.')).toBeInTheDocument();
    expect(screen.getByText('Your Power.')).toBeInTheDocument();
  });

  test('renders hero badge', () => {
    render(<HomePage />);
    expect(screen.getByText(/Electoral Intelligence/i)).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<HomePage />);
    expect(screen.getByText(/The national platform for immersive election literacy/i)).toBeInTheDocument();
  });

  test('renders all CTA buttons in hero', () => {
    render(<HomePage />);
    expect(screen.getByText('Get Started →')).toBeInTheDocument();
    expect(screen.getByText(/Ask AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Take a Quiz/i)).toBeInTheDocument();
  });

  test('renders election statistics', () => {
    render(<HomePage />);
    expect(screen.getByText('96.8Cr')).toBeInTheDocument();
    expect(screen.getByText('10.5L')).toBeInTheDocument();
    expect(screen.getByText('543')).toBeInTheDocument();
    expect(screen.getByText('28+8')).toBeInTheDocument();
  });

  test('renders stat labels', () => {
    render(<HomePage />);
    expect(screen.getByText('Registered Voters')).toBeInTheDocument();
    expect(screen.getByText('Polling Stations')).toBeInTheDocument();
    expect(screen.getByText('Lok Sabha Seats')).toBeInTheDocument();
    expect(screen.getByText('States & UTs')).toBeInTheDocument();
  });

  test('renders all 7 journey stages', () => {
    render(<HomePage />);
    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByText('Verification')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Booth Finder')).toBeInTheDocument();
    expect(screen.getByText('Candidates')).toBeInTheDocument();
    expect(screen.getByText('Polling Day')).toBeInTheDocument();
    expect(screen.getByText('Grievance')).toBeInTheDocument();
  });

  test('renders journey stage subtitles in Hindi', () => {
    render(<HomePage />);
    expect(screen.getByText('Mera Pehla Vote')).toBeInTheDocument();
    expect(screen.getByText('Janch-Parch')).toBeInTheDocument();
    expect(screen.getByText('Chunav Pathshala')).toBeInTheDocument();
  });

  test('renders AI assistant section', () => {
    render(<HomePage />);
    expect(screen.getAllByText(/Chunav Mitra/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Smart Voter Support/i)).toBeInTheDocument();
    expect(screen.getByText('Start Chatting 🤖')).toBeInTheDocument();
  });

  test('renders features section', () => {
    render(<HomePage />);
    expect(screen.getByText('Extraordinary Features')).toBeInTheDocument();
    expect(screen.getByText('Chunav Mitra AI')).toBeInTheDocument();
    expect(screen.getByText('Gamified Learning')).toBeInTheDocument();
    expect(screen.getByText('Booth Locator')).toBeInTheDocument();
    expect(screen.getByText('Works Offline')).toBeInTheDocument();
  });

  test('renders Google Services section', () => {
    render(<HomePage />);
    expect(screen.getByText('Built on the Google Ecosystem')).toBeInTheDocument();
    expect(screen.getByText('Firebase Auth')).toBeInTheDocument();
    expect(screen.getByText('Cloud Firestore')).toBeInTheDocument();
    expect(screen.getByText('Gemini AI')).toBeInTheDocument();
    expect(screen.getByText('Google Maps')).toBeInTheDocument();
    expect(screen.getByText('Google Translate')).toBeInTheDocument();
    expect(screen.getByText('Google Analytics')).toBeInTheDocument();
  });

  test('renders bottom CTA section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Every Vote Counts/i)).toBeInTheDocument();
    expect(screen.getByText('Begin Your Journey →')).toBeInTheDocument();
  });

  test('renders footer component', () => {
    render(<HomePage />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('has correct accessibility landmarks with aria-labelledby', () => {
    render(<HomePage />);
    expect(screen.getByLabelText('Election statistics')).toBeInTheDocument();
  });

  test('journey stage links have unique IDs', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('#stage-01')).not.toBeNull();
    expect(container.querySelector('#stage-07')).not.toBeNull();
  });

  test('CTA bottom button has unique ID', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('#cta-bottom')).not.toBeNull();
  });
});
