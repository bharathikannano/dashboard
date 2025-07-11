import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ProfileSummary from './ProfileSummary';

// Ensure framer-motion mock is used to suppress layout and whileHover prop warnings
jest.mock('framer-motion');

jest.mock('./ProgressBar', () => () => <div data-testid="progress-bar" />);

const mockUser = {
  name: 'Rahul Sharma',
  avatar: 'https://i.pravatar.cc/150?img=11',
  level: 5,
  currentXP: 1250,
  targetXP: 2000,
  badges: ['Premium', 'Early Adopter'],
};

describe('ProfileSummary', () => {
  it('renders the user information correctly', () => {
    act(() => {
      render(<ProfileSummary user={mockUser} />);
    });

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('1250 / 2000 XP')).toBeInTheDocument();
    expect(screen.getByText('Progress to Next Level')).toBeInTheDocument();
    expect(screen.getByText('63%')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Early Adopter')).toBeInTheDocument();
  });

  it('returns null if no user and not loading', () => {
    let container;
    act(() => {
      ({ container } = render(<ProfileSummary user={null} isLoading={false} />));
    });
    expect(container.firstChild).toBeNull();
  });
});
