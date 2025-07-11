import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders without crashing', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('has an initial unchecked state by default', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  it('toggles state when clicked', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');

    // Initial state is unchecked
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    // Click to check
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'checked');

    // Click to uncheck
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
  });

  it('applies custom className', () => {
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
  });

  it('does not toggle state when disabled and clicked', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'unchecked'); // Should remain unchecked
  });

  it('can be controlled with checked prop', () => {
    const { rerender } = render(<Switch checked={false} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    rerender(<Switch checked={true} />);
    expect(switchElement).toHaveAttribute('data-state', 'checked');

    fireEvent.click(switchElement); // Click should not change state if controlled
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('calls onCheckedChange when state changes', () => {
    const handleChange = jest.fn();
    render(<Switch onCheckedChange={handleChange} />);
    const switchElement = screen.getByRole('switch');

    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});
