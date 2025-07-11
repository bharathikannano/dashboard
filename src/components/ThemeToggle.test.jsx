import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const { forwardRef } = require('react');
  const motion = {
    div: forwardRef((props, ref) => <div ref={ref} {...props} />),
    button: forwardRef((props, ref) => <button ref={ref} {...props} />),
    svg: forwardRef((props, ref) => <svg ref={ref} {...props} />),
  };
  return {
    motion,
  };
});

describe('ThemeToggle', () => {
  // Mock matchMedia
  const mockMatchMedia = (matches) => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia(false); // Default to light preference
  });

  it('renders the toggle button with correct initial accessibility label', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('toggles the theme and updates accessibility label on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    // Initial state - light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Toggle to dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // Toggle back to light mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('initializes with dark theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('respects system dark mode preference when no theme is stored', () => {
    mockMatchMedia(true); // Simulate dark mode preference
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('localStorage preference overrides system preference', () => {
    mockMatchMedia(true); // Simulate dark mode preference
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('renders both sun and moon icons', () => {
    render(<ThemeToggle />);
    
    // Check for both icons using their paths
    const sunIcon = document.querySelector('path[d*="M12 3v1m0 16v1m9-9h-1M4"]');
    const moonIcon = document.querySelector('path[d*="M20.354 15.354A9 9 0 018.646"]');
    
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it('applies correct animation props to icons', () => {
    render(<ThemeToggle />);
    
    const [sunIcon, moonIcon] = screen.getAllByRole('img', { hidden: true });
    
    // Initial state (light mode)
    expect(sunIcon).toHaveStyle({ opacity: 0 });
    expect(moonIcon).toHaveStyle({ opacity: 1 });
    
    // Toggle to dark mode
    fireEvent.click(screen.getByRole('button'));
    
    expect(sunIcon).toHaveStyle({ opacity: 1 });
    expect(moonIcon).toHaveStyle({ opacity: 0 });
  });

  it('applies the correct toggle circle position based on theme', () => {
    render(<ThemeToggle />);
    const toggleCircle = screen.getByRole('button').querySelector('div[class*="absolute top-1"]');
    
    // Light mode position
    expect(toggleCircle).toHaveStyle({ left: '0.25rem' });
    
    // Dark mode position
    fireEvent.click(screen.getByRole('button'));
    expect(toggleCircle).toHaveStyle({ left: 'calc(100% - 1.75rem)' });
  });
});
