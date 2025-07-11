import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlyExpenses from './MonthlyExpenses';

// No need to mock framer-motion or recharts here, as the component is simple enough.

const mockExpensesData = [
  { name: 'Groceries', value: 1200 },
  { name: 'Utilities', value: 800 },
  { name: 'Transport', value: 500 },
];

describe('MonthlyExpenses', () => {
  it('renders the section title', () => {
    render(<MonthlyExpenses data={mockExpensesData} />);
    expect(screen.getByText('Monthly Expenses')).toBeInTheDocument();
  });

  it('renders the chart components', () => {
    render(<MonthlyExpenses data={mockExpensesData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('xaxis')).toBeInTheDocument();
    expect(screen.getByTestId('yaxis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});
