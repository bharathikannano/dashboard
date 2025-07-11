import { cn } from './utils';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Mock the modules
jest.mock('clsx');
jest.mock('tailwind-merge');

describe('cn', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should call clsx and twMerge with the provided inputs', () => {
    const inputs = ['class1', 'class2', { 'class3': true }];
    const clsxResult = 'clsx-output';
    const twMergeResult = 'twMerge-output';

    clsx.mockReturnValue(clsxResult);
    twMerge.mockReturnValue(twMergeResult);

    const result = cn(...inputs);

    expect(clsx).toHaveBeenCalledWith(inputs);
    expect(twMerge).toHaveBeenCalledWith(clsxResult);
    expect(result).toBe(twMergeResult);
  });

  it('should handle empty inputs', () => {
    const inputs = [];
    const clsxResult = '';
    const twMergeResult = '';

    clsx.mockReturnValue(clsxResult);
    twMerge.mockReturnValue(twMergeResult);

    const result = cn(...inputs);

    expect(clsx).toHaveBeenCalledWith(inputs);
    expect(twMerge).toHaveBeenCalledWith(clsxResult);
    expect(result).toBe(twMergeResult);
  });

  it('should handle various types of inputs', () => {
    const inputs = ['foo', null, undefined, 'bar', { baz: true, qux: false }];
    const clsxResult = 'foo bar baz';
    const twMergeResult = 'final-merged-classes';

    clsx.mockReturnValue(clsxResult);
    twMerge.mockReturnValue(twMergeResult);

    const result = cn(...inputs);

    expect(clsx).toHaveBeenCalledWith(inputs);
    expect(twMerge).toHaveBeenCalledWith(clsxResult);
    expect(result).toBe(twMergeResult);
  });
});
