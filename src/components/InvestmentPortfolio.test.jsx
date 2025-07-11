import React from 'react';
import { render, screen } from '@testing-library/react';
import InvestmentPortfolio from './InvestmentPortfolio';

// Mock recharts to avoid complex SVG rendering in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
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

describe('InvestmentPortfolio', () => {
  const mockData = [
    { name: 'Jan', value: 400000 },
    { name: 'Feb', value: 410000 },
    { name: 'Mar', value: 450000 },
    { name: 'Apr', value: 440000 },
    { name: 'May', value: 480000 },
    { name: 'Jun', value: 520000 },
  ];

  describe('with valid data', () => {
    it('renders the component with the title', () => {
      render(<InvestmentPortfolio data={mockData} />);
      expect(screen.getByText('Investment Portfolio')).toBeInTheDocument();
    });

    it('displays the latest portfolio value', () => {
      render(<InvestmentPortfolio data={mockData} />);
      expect(screen.getByText('₹520,000')).toBeInTheDocument();
    });

    it('calculates and displays positive growth correctly', () => {
      render(<InvestmentPortfolio data={mockData} />);
      // growth = 520000 - 400000 = 120000
      // percentage = (120000 / 400000) * 100 = 30.00
      expect(screen.getByText('+120,000 (30.00%)')).toBeInTheDocument();
    });

    it('calculates and displays negative growth correctly', () => {
      const negativeGrowthData = [
        { name: 'Jan', value: 500000 },
        { name: 'Feb', value: 400000 },
      ];
      render(<InvestmentPortfolio data={negativeGrowthData} />);
      // latest = 400000
      // growth = 400000 - 500000 = -100000
      // percentage = (-100000 / 500000) * 100 = -20.00
      expect(screen.getByText('₹400,000')).toBeInTheDocument();
      expect(screen.getByText('-100,000 (-20.00%)')).toBeInTheDocument();
    });

    it('renders the chart components', () => {
      render(<InvestmentPortfolio data={mockData} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByTestId('xaxis')).toBeInTheDocument();
      expect(screen.getByTestId('yaxis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('with edge case data', () => {
    it.each([
      { name: 'empty array', data: [] },
      { name: 'null', data: null },
      { name: 'undefined', data: undefined },
    ])('renders a message when data is $name', ({ data }) => {
      render(<InvestmentPortfolio data={data} />);
      expect(screen.getByText('No investment data available.')).toBeInTheDocument();
      expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    });

    it('handles a single data point gracefully', () => {
      const singlePointData = [{ name: 'Jan', value: 100000 }];
      render(<InvestmentPortfolio data={singlePointData} />);

      expect(screen.getByText('₹100,000')).toBeInTheDocument();
      // Growth is 0 when there's only one data point
      expect(screen.getByText('+0 (0.00%)')).toBeInTheDocument();
    });

    it('handles an initial value of zero without crashing', () => {
      const zeroInitialData = [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 1000 },
      ];
      render(<InvestmentPortfolio data={zeroInitialData} />);

      expect(screen.getByText('₹1,000')).toBeInTheDocument();
      
      // Growth value is shown, and percentage is handled
      expect(screen.getByText('+1,000 (0.00%)')).toBeInTheDocument();
    });
  });
});
