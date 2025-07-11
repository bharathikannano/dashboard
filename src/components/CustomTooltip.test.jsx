import React from 'react';
import { render, screen, act } from '@testing-library/react';
import CustomTooltip from './CustomTooltip';

// No need to mock framer-motion here, as the component is simple enough.

describe('CustomTooltip', () => {
  const mockPayload = [
    {
      payload: { name: 'Jan', value: 100000 },
      name: 'value',
      value: 100000,
      color: '#8884d8',
    },
  ];

  it('renders the tooltip when active', () => {
    act(() => {
      render(<CustomTooltip active={true} payload={mockPayload} label="Jan" />);
    });

    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
    expect(screen.getByText('100000')).toBeInTheDocument();
  });

  it('returns null when not active', () => {
    let container;
    act(() => {
      ({ container } = render(<CustomTooltip active={false} payload={mockPayload} label="Jan" />));
    });
    expect(container.firstChild).toBeNull();
  });

  it('returns null when payload is empty', () => {
    let container;
    act(() => {
      ({ container } = render(<CustomTooltip active={true} payload={[]} label="Jan" />));
    });
    expect(container.firstChild).toBeNull();
  });
});
