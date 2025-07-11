import React from 'react';
import { render, screen } from '@testing-library/react';
import RewardPoints from './RewardPoints';

// No need to mock framer-motion here, as the component is simple enough.

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

jest.mock('./AnimatedCounter', () => ({ value }) => <span data-testid="animated-counter">{value}</span>);
jest.mock('./ThemeProvider', () => ({
  useTheme: () => ({ isDarkMode: false }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));


const mockPointsData = [
  { name: 'Shopping', value: 4500 },
  { name: 'Bill Payments', value: 3200 },
];

const mockHistoryData = [
  { month: 'Jan', points: 2400 },
  { month: 'Feb', points: 1398 },
];

describe('RewardPoints', () => {
  it('renders the section title', () => {
    render(<RewardPoints pointsData={mockPointsData} historyData={mockHistoryData} />);
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  it('renders the total points', () => {
    render(<RewardPoints pointsData={mockPointsData} historyData={mockHistoryData} />);
    expect(screen.getByTestId('animated-counter')).toHaveTextContent('7700');
  });

  it('renders the pie chart and line chart', () => {
    render(<RewardPoints pointsData={mockPointsData} historyData={mockHistoryData} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('returns null if no data and not loading', () => {
    const { container } = render(<RewardPoints pointsData={null} historyData={null} isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });
});
