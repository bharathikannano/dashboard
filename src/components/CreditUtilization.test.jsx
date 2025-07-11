import React from 'react';
import { render, screen } from '@testing-library/react';
import CreditUtilization from './CreditUtilization';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';

// Mock framer-motion components
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, variants, initial, animate, layout, className }) => (
      <div data-testid="motion-div" className={className}>{children}</div>
    ),
    h2: ({ children, variants, className }) => (
      <h2 className={className}>{children}</h2>
    ),
  },
}));

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: 'div',
  RadialBarChart: ({ children, data, ...props }) => (
    <div data-testid="radial-bar-chart" data-data={JSON.stringify(data)} {...props}>{children}</div>
  ),
  RadialBar: ({ children, ...rest }) => {
    const { fill, dataKey, cornerRadius, background, isAnimationActive, ...htmlProps } = rest;
    return <div data-testid="radial-bar" {...htmlProps}>{children}</div>;
  },
  PolarAngleAxis: ({ ...props }) => <div data-testid="polar-angle-axis" {...props} />,
}));

describe('CreditUtilization', () => {
  it('renders the component with the correct data and percentage', () => {
    const mockData = {
      used: 70000,
      limit: 200000,
    };
    render(<CreditUtilization {...mockData} />);

    expect(screen.getByText('Credit Utilization')).toBeInTheDocument();
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByText('₹70,000 / ₹200,000')).toBeInTheDocument();
    expect(screen.getByText('Used of your credit limit')).toBeInTheDocument();

    // Verify RadialBarChart received correct data
    const radialBarChart = screen.getByTestId('radial-bar-chart');
    expect(radialBarChart).toHaveAttribute('data-data', JSON.stringify([{ name: 'utilization', value: 35 }]));
  });

  it('handles 0% utilization', () => {
    const mockData = {
      used: 0,
      limit: 100000,
    };
    render(<CreditUtilization {...mockData} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('₹0 / ₹100,000')).toBeInTheDocument();
    const radialBarChart = screen.getByTestId('radial-bar-chart');
    expect(radialBarChart).toHaveAttribute('data-data', JSON.stringify([{ name: 'utilization', value: 0 }]));
  });

  it('handles 100% utilization', () => {
    const mockData = {
      used: 100000,
      limit: 100000,
    };
    render(<CreditUtilization {...mockData} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('₹100,000 / ₹100,000')).toBeInTheDocument();
    const radialBarChart = screen.getByTestId('radial-bar-chart');
    expect(radialBarChart).toHaveAttribute('data-data', JSON.stringify([{ name: 'utilization', value: 100 }]));
  });

  it('handles limit being zero (should result in 100% if used > 0)', () => {
    const mockData = {
      used: 500,
      limit: 0,
    };
    render(<CreditUtilization {...mockData} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('₹500 / ₹0')).toBeInTheDocument();
    const radialBarChart = screen.getByTestId('radial-bar-chart');
    expect(radialBarChart).toHaveAttribute('data-data', JSON.stringify([{ name: 'utilization', value: 100 }]));
  });

  it('handles both used and limit being zero', () => {
    const mockData = {
      used: 0,
      limit: 0,
    };
    render(<CreditUtilization {...mockData} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('₹0 / ₹0')).toBeInTheDocument();
    const radialBarChart = screen.getByTestId('radial-bar-chart');
    expect(radialBarChart).toHaveAttribute('data-data', JSON.stringify([{ name: 'utilization', value: 0 }]));
  });
});
