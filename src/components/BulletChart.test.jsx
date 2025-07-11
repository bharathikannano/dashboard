import React from 'react';
import { render, screen } from '@testing-library/react';
import BulletChart from './BulletChart';

// Mock framer-motion's motion component to control its behavior in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, initial, transition, className }) => (
      <div data-testid="motion-div" style={animate} className={className}>
        {children}
      </div>
    ),
    h2: ({ children, initial, animate, transition, className }) => (
      <h2 className={className}>{children}</h2>
    ),
    h3: ({ children, layout, className }) => (
      <h3 className={className}>{children}</h3>
    ),
    p: ({ children, layout, className }) => (
      <p className={className}>{children}</p>
    ),
    button: ({ children, whileHover, whileTap, transition, className }) => (
      <button className={className}>{children}</button>
    ),
  },
}));

describe('BulletChart', () => {
  it('renders the chart with the correct data and calculates percentage correctly', () => {
    const mockData = {
      name: 'Vacation',
      saved: 25000,
      goal: 50000,
    };
    render(<BulletChart {...mockData} />);

    expect(screen.getByText('Vacation')).toBeInTheDocument();
    expect(screen.getByText('₹25,000 / ₹50,000')).toBeInTheDocument();

    // Check the width of the progress bar based on the percentage
    const progressBar = screen.getByTestId('motion-div');
    expect(progressBar).toHaveStyle('width: 50%');
  });

  it('handles the case where saved exceeds goal, capping percentage at 100%', () => {
    const mockData = {
      name: 'New Car',
      saved: 250000,
      goal: 200000,
    };
    render(<BulletChart {...mockData} />);

    expect(screen.getByText('New Car')).toBeInTheDocument();
    expect(screen.getByText('₹250,000 / ₹200,000')).toBeInTheDocument();

    // Percentage should be capped at 100%
    const progressBar = screen.getByTestId('motion-div');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('handles zero saved amount', () => {
    const mockData = {
      name: 'Zero Savings',
      saved: 0,
      goal: 10000,
    };
    render(<BulletChart {...mockData} />);

    expect(screen.getByText('Zero Savings')).toBeInTheDocument();
    expect(screen.getByText('₹0 / ₹10,000')).toBeInTheDocument();

    const progressBar = screen.getByTestId('motion-div');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('handles zero goal amount (should cap percentage at 100% if saved > 0)', () => {
    const mockData = {
      name: 'Zero Goal',
      saved: 100,
      goal: 0,
    };
    render(<BulletChart {...mockData} />);

    expect(screen.getByText('Zero Goal')).toBeInTheDocument();
    expect(screen.getByText('₹100 / ₹0')).toBeInTheDocument();

    const progressBar = screen.getByTestId('motion-div');
    expect(progressBar).toHaveStyle('width: 100%'); // (100 / 0) is Infinity, Math.min caps it at 100
  });

  it('handles zero saved and zero goal amount', () => {
    const mockData = {
      name: 'Zero Zero',
      saved: 0,
      goal: 0,
    };
    render(<BulletChart {...mockData} />);

    expect(screen.getByText('Zero Zero')).toBeInTheDocument();
    expect(screen.getByText('₹0 / ₹0')).toBeInTheDocument();

    const progressBar = screen.getByTestId('motion-div');
    expect(progressBar).toHaveStyle('width: 0%'); // (0 / 0) is NaN, Math.min(NaN, 100) is NaN, but it should default to 0% or be handled gracefully. In this case, it will be 0% because of the initial width: 0 in framer-motion.
  });
});
