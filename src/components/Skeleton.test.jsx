import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Skeleton, { ProfileSkeleton, BenefitCardSkeleton, RewardPointsSkeleton } from './Skeleton';

jest.mock('framer-motion', () => {
  const { forwardRef } = require('react');
  const motion = {
    div: forwardRef((props, ref) => <div ref={ref} {...props} />),
  };
  return {
    motion,
  };
});

describe('Skeleton Components', () => {
  it('renders the base Skeleton component', () => {
    act(() => {
      render(<Skeleton data-testid="base-skeleton" />);
    });
    expect(screen.getByTestId('base-skeleton')).toBeInTheDocument();
  });

  it('renders the ProfileSkeleton', () => {
    let container;
    act(() => {
      ({ container } = render(<ProfileSkeleton />));
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the BenefitCardSkeleton', () => {
    let container;
    act(() => {
      ({ container } = render(<BenefitCardSkeleton />));
    });
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the RewardPointsSkeleton', () => {
    let container;
    act(() => {
      ({ container } = render(<RewardPointsSkeleton />));
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
