import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

// No need to mock framer-motion here, as the component is simple enough.

describe('ProgressBar', () => {
  it('renders the progress bar with the correct width', () => {
    render(<ProgressBar value={50} />);
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar.firstChild).toHaveStyle('width: 50%');
  });
});
