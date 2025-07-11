import React from 'react';
import { render, screen, act } from '@testing-library/react';
import SavingsGoals from './SavingsGoals';

// Mock recharts to avoid complex SVG rendering in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children }) => <div data-testid="composed-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock framer-motion to remove animation logic from tests
jest.mock('framer-motion', () => {
  const { forwardRef } = require('react');
  const motion = {
    div: forwardRef(({ layout, ...props }, ref) => <div ref={ref} {...props} />),
    h2: forwardRef((props, ref) => <h2 ref={ref} {...props} />),
    p: forwardRef((props, ref) => <p ref={ref} {...props} />),
  };
  return {
    motion,
  };
});

describe('SavingsGoals', () => {
  const mockData = [
    { name: 'Vacation', saved: 2500, goal: 5000 },
    { name: 'New Car', saved: 8000, goal: 20000 },
    { name: 'Gadgets', saved: 1500, goal: 3000 },
    { name: 'Emergency', saved: 10000, goal: 10000 },
  ];

  describe('with valid data', () => {
    it('renders the component with the title', () => {
      act(() => {
        render(<SavingsGoals data={mockData} />);
      });
      expect(screen.getByText('Savings Goals')).toBeInTheDocument();
    });

    it('renders the chart and its components', () => {
      act(() => {
        render(<SavingsGoals data={mockData} />);
      });
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar')).toBeInTheDocument();
      expect(screen.getByTestId('line')).toBeInTheDocument();
      expect(screen.getByTestId('xaxis')).toBeInTheDocument();
      expect(screen.getByTestId('yaxis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('with edge case data', () => {
    it.each([
      { name: 'empty array', data: [] },
      { name: 'null', data: null },
      { name: 'undefined', data: undefined },
    ])('renders a message when data is $name', ({ data }) => {
      act(() => {
        render(<SavingsGoals data={data} />);
      });
      expect(screen.getByText('No savings goals available.')).toBeInTheDocument();
      expect(screen.queryByTestId('composed-chart')).not.toBeInTheDocument();
    });
  });
});