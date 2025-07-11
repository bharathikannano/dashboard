import React from 'react';
import { render, screen } from '@testing-library/react';
import BenefitsSection from './BenefitsSection';

// No need to mock framer-motion here, as the component is simple enough.

const mockBenefits = [
  {
    icon: '🛍️',
    title: 'CRED Store',
    description: 'Exclusive products at member-only prices with free delivery.',
    cta: 'Shop Now'
  },
  {
    icon: '✈️',
    title: 'Travel Benefits',
    description: 'Special discounts on flights, hotels and holiday packages.',
    cta: 'Explore'
  },
];

describe('BenefitsSection', () => {
  it('renders the section title', () => {
    render(<BenefitsSection benefits={mockBenefits} />);
    expect(screen.getByText('Your Benefits')).toBeInTheDocument();
  });

  it('renders the correct number of benefit cards', () => {
    render(<BenefitsSection benefits={mockBenefits} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders the content of each benefit card', () => {
    render(<BenefitsSection benefits={mockBenefits} />);
    expect(screen.getByText('CRED Store')).toBeInTheDocument();
    expect(screen.getByText('Exclusive products at member-only prices with free delivery.')).toBeInTheDocument();
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('Travel Benefits')).toBeInTheDocument();
    expect(screen.getByText('Special discounts on flights, hotels and holiday packages.')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });
});
