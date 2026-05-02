/**
 * @jest-environment jsdom
 * 
 * InteractiveMap Component Tests
 * 
 * Validates rendering, state interaction, and data display
 * of the InteractiveMap component used in the Live Results page.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InteractiveMap from '../InteractiveMap';

describe('InteractiveMap Component', () => {
  test('renders the interactive map container', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('Interactive Mode')).toBeInTheDocument();
  });

  test('renders all 10 state buttons in the grid', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('Uttar Pradesh')).toBeInTheDocument();
    expect(screen.getByText('Maharashtra')).toBeInTheDocument();
    expect(screen.getByText('West Bengal')).toBeInTheDocument();
    expect(screen.getByText('Bihar')).toBeInTheDocument();
    expect(screen.getByText('Tamil Nadu')).toBeInTheDocument();
    expect(screen.getByText('Madhya Pradesh')).toBeInTheDocument();
    expect(screen.getByText('Karnataka')).toBeInTheDocument();
    expect(screen.getByText('Gujarat')).toBeInTheDocument();
    expect(screen.getByText('Andhra Pradesh')).toBeInTheDocument();
    expect(screen.getByText('Rajasthan')).toBeInTheDocument();
  });

  test('displays seat count for each state', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('80 Seats')).toBeInTheDocument();
    expect(screen.getByText('48 Seats')).toBeInTheDocument();
    expect(screen.getByText('42 Seats')).toBeInTheDocument();
  });

  test('renders legend items for NDA and INDIA', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('NDA')).toBeInTheDocument();
    expect(screen.getByText('INDIA')).toBeInTheDocument();
  });

  test('shows state details on hover', () => {
    render(<InteractiveMap />);
    const upButton = screen.getByText('Uttar Pradesh').closest('button');
    fireEvent.mouseEnter(upButton);
    // Should show the state highlights overlay
    expect(screen.getByText('State Highlights')).toBeInTheDocument();
  });

  test('hides state details on mouse leave', () => {
    render(<InteractiveMap />);
    const upButton = screen.getByText('Uttar Pradesh').closest('button');
    fireEvent.mouseEnter(upButton);
    expect(screen.getByText('State Highlights')).toBeInTheDocument();
    fireEvent.mouseLeave(upButton);
    expect(screen.queryByText('State Highlights')).not.toBeInTheDocument();
  });

  test('displays state abbreviations', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('UP')).toBeInTheDocument();
    expect(screen.getByText('MH')).toBeInTheDocument();
    expect(screen.getByText('GJ')).toBeInTheDocument();
  });

  test('SVG paths trigger hover state', () => {
    render(<InteractiveMap />);
    const upPath = screen.getByTestId('state-path-up');
    
    fireEvent.mouseEnter(upPath);
    expect(screen.getAllByText('Uttar Pradesh').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('80')).toBeInTheDocument();
    
    fireEvent.mouseLeave(upPath);
    expect(screen.getAllByText('Uttar Pradesh').length).toBe(1);
  });

  test('SVG paths trigger selection on click', () => {
    render(<InteractiveMap />);
    const mhPath = screen.getByTestId('state-path-mh');
    
    fireEvent.click(mhPath);
    expect(screen.getAllByText(/Maharashtra/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('INDIA').length).toBeGreaterThanOrEqual(2);
  });

  test('all paths trigger click and hover', () => {
    render(<InteractiveMap />);
    const ids = ['up', 'mh', 'wb', 'tn'];
    ids.forEach(id => {
      const path = screen.getByTestId(`state-path-${id}`);
      fireEvent.mouseEnter(path);
      fireEvent.click(path);
      fireEvent.mouseLeave(path);
    });
    expect(screen.getAllByText(/Tamil Nadu/).length).toBeGreaterThanOrEqual(1);
  });
});
