import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock all components to ensure App.js logic is tested in isolation
jest.mock('./components/ThemeProvider', () => ({ children }) => <div data-testid="theme-provider">{children}</div>);
jest.mock('./components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);
jest.mock('./components/ProfileSummary', () => ({ user }) => <div data-testid="profile-summary">Profile: {user?.name}</div>);
jest.mock('./components/BenefitsSection', () => ({ benefits }) => <div data-testid="benefits-section">Benefits: {benefits?.length}</div>);
jest.mock('./components/RewardPoints', () => ({ pointsData, historyData }) => <div data-testid="reward-points">Reward Points</div>);
jest.mock('./components/MonthlyExpenses', () => ({ data }) => <div data-testid="monthly-expenses">Monthly Expenses</div>);
jest.mock('./components/TransactionHistory', () => ({ data }) => <div data-testid="transaction-history">Transaction History</div>);
jest.mock('./components/CreditUtilization', () => ({ used, limit }) => <div data-testid="credit-utilization">Credit Utilization</div>);
jest.mock('./components/InvestmentPortfolio', () => ({ data }) => <div data-testid="investment-portfolio">Investment Portfolio</div>);
jest.mock('./components/SavingsGoals', () => ({ data }) => <div data-testid="savings-goals">Savings Goals</div>);
jest.mock('./components/Skeleton', () => ({
  ProfileSkeleton: () => <div data-testid="profile-skeleton" />,
  BenefitCardSkeleton: () => <div data-testid="benefit-card-skeleton" />,
  RewardPointsSkeleton: () => <div data-testid="reward-points-skeleton" />,
}));

jest.useFakeTimers();

describe('App', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders initial loading states (skeletons)', () => {
    render(<App />);

    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Your Benefits')).toBeInTheDocument();
    expect(screen.getAllByTestId('benefit-card-skeleton').length).toBe(6);
    expect(screen.getAllByTestId('reward-points-skeleton').length).toBeGreaterThanOrEqual(1); // Used for multiple sections
  });

  test('renders main dashboard components after data loads', async () => {
    render(<App />);

    // Fast-forward timers to simulate data fetching completion
    act(() => {
      jest.runAllTimers();
    });

    // Verify that skeletons are removed and actual components are rendered
    expect(screen.queryByTestId('profile-skeleton')).not.toBeInTheDocument();
    expect(screen.queryByText('Your Benefits')).not.toBeInTheDocument(); // Heading should be gone as BenefitsSection takes over
    expect(screen.queryAllByTestId('benefit-card-skeleton').length).toBe(0);
    expect(screen.queryAllByTestId('reward-points-skeleton').length).toBe(0);

    // Verify actual components are rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /CRED Garage/i })).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('profile-summary')).toBeInTheDocument();
    expect(screen.getByTestId('benefits-section')).toBeInTheDocument();
    expect(screen.getByTestId('reward-points')).toBeInTheDocument();
    expect(screen.getByTestId('monthly-expenses')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-history')).toBeInTheDocument();
    expect(screen.getByTestId('credit-utilization')).toBeInTheDocument();
    expect(screen.getByTestId('investment-portfolio')).toBeInTheDocument();
    expect(screen.getByTestId('savings-goals')).toBeInTheDocument();
  });

  test('renders the footer', () => {
    render(<App />);
    expect(screen.getByText(/© 2025 CRED Garage. All rights reserved./i)).toBeInTheDocument();
  });

  test('useEffect cleanup function is called on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<App />);

    // Simulate unmounting the component
    unmount();

    // Expect clearTimeout to have been called for each timer set in useEffect
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(3); // userTimer, benefitsTimer, pointsTimer
    clearTimeoutSpy.mockRestore();
  });
});
