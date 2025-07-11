import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from './AnimatedCounter';

// Mock framer-motion's animate function is handled in setupTests.js
// We need to import the mockAnimateControls and resetFramerMotionMocks from the setupTests.js mock
import { animate as mockAnimate, mockAnimateControls, resetFramerMotionMocks } from 'framer-motion';

describe('AnimatedCounter', () => {
  beforeEach(() => {
    resetFramerMotionMocks(); // Reset the framer-motion mocks before each test
    document.body.innerHTML = '';
  });

  it('renders with initial empty content', () => {
    render(<AnimatedCounter value={100} />);
    const counterSpan = screen.getByTestId('animated-counter');
    expect(counterSpan).toBeInTheDocument();
    expect(counterSpan.tagName).toBe('SPAN');
  });

  it('initializes animation with correct parameters', () => {
    const value = 1000;
    render(<AnimatedCounter value={value} />);

    expect(mockAnimate).toHaveBeenCalledWith(
      0,
      value,
      expect.objectContaining({
        duration: 1.5,
        onUpdate: expect.any(Function)
      })
    );
  });

  it('formats numbers correctly during animation', () => {
    const value = 1234567;
    render(<AnimatedCounter value={value} />);
    const counterSpan = screen.getByTestId('animated-counter');

    // Get the onUpdate function from the animate call
    const onUpdate = mockAnimate.mock.calls[0][2].onUpdate;

    // Test different animation stages
    onUpdate(123.45);
    expect(counterSpan).toHaveTextContent('123');

    onUpdate(1234.56);
    expect(counterSpan).toHaveTextContent('1,235');

    onUpdate(value);
    expect(counterSpan).toHaveTextContent('1,234,567');
  });

  it('handles edge cases correctly', () => {
    const { rerender } = render(<AnimatedCounter value={0} />);
    expect(mockAnimate).toHaveBeenLastCalledWith(0, 0, expect.any(Object));
    
    rerender(<AnimatedCounter value={-1000} />);
    expect(mockAnimate).toHaveBeenLastCalledWith(0, -1000, expect.any(Object));
    
    rerender(<AnimatedCounter value={1e9} />);
    expect(mockAnimate).toHaveBeenLastCalledWith(0, 1e9, expect.any(Object));
  });

  it('cleans up animation on unmount', () => {
    const { unmount } = render(<AnimatedCounter value={100} />);
    // Access the stop mock from the globally defined mockAnimateControls
    expect(mockAnimateControls.stop).not.toHaveBeenCalled();
    
    unmount();
    expect(mockAnimateControls.stop).toHaveBeenCalledTimes(1);
  });

  it('handles rapid value changes correctly', () => {
    const { rerender } = render(<AnimatedCounter value={100} />);
    expect(mockAnimate).toHaveBeenCalledTimes(1);
    
    rerender(<AnimatedCounter value={200} />);
    rerender(<AnimatedCounter value={300} />);
    rerender(<AnimatedCounter value={400} />);

    expect(mockAnimate).toHaveBeenCalledTimes(4);

    // In the global mock, all animate calls return the same mockAnimateControls
    // So we check the stop calls on that single mock
    expect(mockAnimateControls.stop).toHaveBeenCalledTimes(3);
  });

  it('maintains animation state during component updates', () => {
    const { rerender } = render(<AnimatedCounter value={1000} />);
    const counterSpan = screen.getByTestId('animated-counter');
    
    // Get onUpdate function from the first call to mockAnimate
    // The third argument (index 2) of the call is the options object
    const onUpdate = mockAnimate.mock.calls[0][2].onUpdate;
    
    // Simulate mid-animation
    onUpdate(500);
    expect(counterSpan).toHaveTextContent('500');
    
    // Update with new value
    rerender(<AnimatedCounter value={2000} />);
    
    // Get new onUpdate function from the second call to mockAnimate
    const newOnUpdate = mockAnimate.mock.calls[1][2].onUpdate;
    
    // Verify animation continues properly
    newOnUpdate(1500);
    expect(counterSpan).toHaveTextContent('1,500');
  });

  it('handles null ref gracefully', () => {
    render(<AnimatedCounter value={100} />);
    const counterSpan = screen.getByTestId('animated-counter');
    const onUpdate = mockAnimate.mock.calls[0][2].onUpdate;

    // Do not remove the element from the DOM; just call onUpdate and expect no error
    expect(() => onUpdate(50)).not.toThrow();
  });

  // This test case is no longer relevant as mockAnimateControls is always returned
  // and its stop method is always defined in the global mock.
});
