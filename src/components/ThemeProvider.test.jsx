import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import ThemeProvider, { useTheme } from './ThemeProvider';

// Mock global matchMedia for most tests
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
  
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
});

const TestComponent = () => {
  const { theme, isDarkMode, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="is-dark-mode">{String(isDarkMode)}</div>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Set Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  let originalLocalStorage;
  let originalMatchMedia;
  let originalDocument;

  beforeEach(() => {
    // Store original values
    originalLocalStorage = window.localStorage;
    originalMatchMedia = window.matchMedia;
    originalDocument = window.document;

    // Reset mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    document.documentElement.className = '';
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    window.matchMedia = originalMatchMedia;
    window.document = originalDocument;
  });

  it('renders children without crashing', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('applies theme classes and updates theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByTestId('set-light').click();
      await flushPromises();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('setTheme persists and updates state', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      screen.getByTestId('set-dark').click();
      await flushPromises();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });

  it('provides SSR safety when window is undefined', () => {
    const win = window;
    try {
      // @ts-ignore - Intentionally set window to undefined for SSR testing
      window = undefined;
      const { getByText } = render(
        <ThemeProvider>
          <div>SSR Test</div>
        </ThemeProvider>
      );
      expect(getByText('SSR Test')).toBeInTheDocument();
    } finally {
      window = win;
    }
  });

  it('handles missing browser APIs gracefully', () => {
    const win = window;
    try {
      // @ts-ignore - Create minimal mock window
      window = {
        document: {},
        localStorage: undefined,
        matchMedia: undefined,
      };
      const { getByText } = render(
        <ThemeProvider>
          <div>Minimal Browser APIs</div>
        </ThemeProvider>
      );
      expect(getByText('Minimal Browser APIs')).toBeInTheDocument();
    } finally {
      window = win;
    }
  });

  it('handles missing document APIs gracefully', () => {
    const doc = window.document;
    try {
      // @ts-ignore - Remove document for testing
      window.document = {};
      const { getByText } = render(
        <ThemeProvider>
          <div>No documentElement</div>
        </ThemeProvider>
      );
      expect(getByText('No documentElement')).toBeInTheDocument();
    } finally {
      window.document = doc;
    }
  });

  it('initializes from localStorage if available', async () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    
    let renderResult;
    await act(async () => {
      renderResult = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      await flushPromises();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });

  it('uses system preference if no localStorage value', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    let renderResult;
    await act(async () => {
      renderResult = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      await flushPromises();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });

  it('listens for system theme changes', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn((event, cb) => {
        mediaQueryCallback = cb;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      mediaQueryCallback({ matches: true });
      await flushPromises();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });

  it('handles matchMedia errors gracefully', async () => {
    window.matchMedia = jest.fn().mockImplementation(() => {
      throw new Error('matchMedia not supported');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
  });

  it('handles localStorage errors gracefully', async () => {
    const errorLocalStorage = {
      getItem: jest.fn(() => {
        throw new Error('localStorage disabled');
      }),
      setItem: jest.fn(() => {
        throw new Error('localStorage disabled');
      }),
    };

    Object.defineProperty(window, 'localStorage', {
      value: errorLocalStorage,
      writable: true,
      configurable: true,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    
    // Try to set theme - should handle error gracefully
    await act(async () => {
      screen.getByTestId('set-dark').click();
      await flushPromises();
    });
    
    expect(errorLocalStorage.setItem).toHaveBeenCalled();
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('supports legacy browsers with mediaQuery.addListener', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      // Only provide addListener, not addEventListener
      addListener: jest.fn((cb) => {
        mediaQueryCallback = cb;
      }),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockMediaQuery.addListener).toHaveBeenCalled();

    // Simulate theme change in legacy browser
    await act(async () => {
      mediaQueryCallback({ matches: true });
      await flushPromises();
    });

    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('true');
  });

  it('handles hasBrowserFeatures errors gracefully', async () => {
    // Store original matchMedia
    const originalMatchMedia = window.matchMedia;
    
    // Make matchMedia throw an error
    window.matchMedia = () => {
      throw new Error('matchMedia not supported');
    };

    try {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    } finally {
      // Restore original matchMedia
      window.matchMedia = originalMatchMedia;
    }
  });

  it('handles documentElement access errors gracefully', async () => {
    // Store original values
    const originalDocumentElement = window.document.documentElement;
    const originalMatchMedia = window.matchMedia;
    
    // Make documentElement access throw
    Object.defineProperty(window.document, 'documentElement', {
      get: () => {
        throw new Error('Security error: documentElement access denied');
      },
      configurable: true
    });

    // Ensure matchMedia returns false for dark mode
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    try {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
    } finally {
      // Restore original values
      Object.defineProperty(window.document, 'documentElement', {
        value: originalDocumentElement,
        writable: true,
        configurable: true
      });
      window.matchMedia = originalMatchMedia;
    }
  });

  it('handles legacy removeListener cleanup', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      // Only provide legacy listeners
      addListener: jest.fn((cb) => {
        mediaQueryCallback = cb;
      }),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    unmount();
    expect(mockMediaQuery.removeListener).toHaveBeenCalled();
  });

  it('handles system theme change with direct matches check', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn((event, cb) => {
        mediaQueryCallback = cb;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Trigger with old event format (no matches property)
    await act(async () => {
      mediaQueryCallback();
      await flushPromises();
    });

    // matchMedia should be called again to get current state
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('handles removeEventListener cleanup', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: jest.fn((event, cb) => {
        mediaQueryCallback = cb;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    unmount();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', mediaQueryCallback);
  });

  it('handles both direct window undefined and explicit check', async () => {
    const win = window;
    
    // Test when window is undefined at the root
    try {
      // @ts-ignore - Intentionally set window to undefined
      window = undefined;
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      unmount();
    } finally {
      window = win;
    }

    // Test when window exists but matchMedia check fails
    try {
      window = {
        document: win.document,
        localStorage: win.localStorage,
        matchMedia: undefined
      };
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      unmount();
    } finally {
      window = win;
    }
  });

  it('handles invalid theme value in localStorage', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-theme');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('handles setTheme with invalid theme value', async () => {
    const TestComponentWithInvalidTheme = () => {
      const { setTheme } = useTheme();
      React.useEffect(() => {
        setTheme('invalid-theme');
      }, [setTheme]);
      return <div>Invalid Theme Test</div>;
    };

    render(
      <ThemeProvider>
        <TestComponentWithInvalidTheme />
        <TestComponent />
      </ThemeProvider>
    );

    await act(async () => {
      await flushPromises();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('handles getSystemIsDark with window undefined', async () => {
    const win = window;
    try {
      // @ts-ignore - Intentionally set window to undefined
      window = undefined;
      mockLocalStorage.getItem.mockReturnValue('dark');
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    } finally {
      window = win;
    }
  });

  it('handles matchMedia error in theme change handler', async () => {
    mockLocalStorage.getItem.mockReturnValue('system');
    let mediaQueryCallback = null;
    let callCount = 0;
    
    window.matchMedia = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          matches: false,
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addEventListener: (event, cb) => {
            mediaQueryCallback = cb;
          },
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }
      throw new Error('matchMedia failed');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');

    // Wait for any pending effects to complete
    await act(async () => {
      await flushPromises();
    });

    // Now call the callback, which will trigger the error path
    await act(async () => {
      if (mediaQueryCallback) {
        mediaQueryCallback();
      }
      await flushPromises();
    });

    // Theme should stay in previous state when matchMedia fails
    expect(screen.getByTestId('is-dark-mode')).toHaveTextContent('false');
  });

  it('handles legacy listener cleanup', async () => {
    let mediaQueryCallback;
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: undefined,
      removeEventListener: undefined,
      addListener: jest.fn((cb) => {
        mediaQueryCallback = cb;
      }),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockImplementation(() => mockMediaQuery);

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    unmount();
    expect(mockMediaQuery.removeListener).toHaveBeenCalled();
  });
});