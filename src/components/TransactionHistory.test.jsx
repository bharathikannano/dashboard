import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TransactionHistory from './TransactionHistory';

// Ensure framer-motion mock is used to suppress layout prop warnings
jest.mock('framer-motion');

const mockTransactionData = [
  { icon: '🍔', name: 'Zomato', date: '2023-07-10', amount: '-₹550' },
  { icon: '🛒', name: 'Myntra', date: '2023-07-09', amount: '-₹2,500' },
  { icon: '💰', name: 'Salary Credit', date: '2023-07-01', amount: '+₹50,000' },
];

describe('TransactionHistory', () => {
  it('renders the section title', () => {
    act(() => {
      render(<TransactionHistory data={mockTransactionData} />);
    });
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('renders the correct number of transactions', () => {
    act(() => {
      render(<TransactionHistory data={mockTransactionData} />);
    });
    expect(screen.getAllByText(/₹/)).toHaveLength(3);
  });

  it('renders the transaction data correctly', () => {
    act(() => {
      render(<TransactionHistory data={mockTransactionData} />);
    });
    expect(screen.getByText('Zomato')).toBeInTheDocument();
    expect(screen.getByText('2023-07-10')).toBeInTheDocument();
    expect(screen.getByText('-₹550')).toBeInTheDocument();
    expect(screen.getByText('Myntra')).toBeInTheDocument();
    expect(screen.getByText('2023-07-09')).toBeInTheDocument();
    expect(screen.getByText('-₹2,500')).toBeInTheDocument();
    expect(screen.getByText('Salary Credit')).toBeInTheDocument();
    expect(screen.getByText('2023-07-01')).toBeInTheDocument();
    expect(screen.getByText('+₹50,000')).toBeInTheDocument();
  });
});
