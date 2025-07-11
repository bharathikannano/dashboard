// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:

// Mock React.act to suppress the warning about ReactDOMTestUtils.act being deprecated
global.IS_REACT_ACT_ENVIRONMENT = true;
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react'; // Import React to fix ReferenceError

// Define a stable mock controls object for framer-motion, accessible globally
const mockAnimateControls = {
  stop: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // Default to light mode
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Ensure document.documentElement.classList is a real DOMTokenList
// Remove any previous mock and use jsdom's default
if (window.document && window.document.documentElement) {
  // Reset classList to jsdom's default implementation
  window.document.documentElement.classList.add = window.document.documentElement.classList.add.bind(window.document.documentElement.classList);
  window.document.documentElement.classList.remove = window.document.documentElement.classList.remove.bind(window.document.documentElement.classList);
  window.document.documentElement.classList.contains = window.document.documentElement.classList.contains.bind(window.document.documentElement.classList);
}

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// Mock framer-motion to remove animation logic from tests and handle props
jest.mock('framer-motion', () => {
  const { forwardRef } = require('react');
  const motion = {
    div: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    h1: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <h1 ref={ref} {...props}>{children}</h1>),
    h2: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <h2 ref={ref} {...props}>{children}</h2>),
    p: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <p ref={ref} {...props}>{children}</p>),
    button: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <button ref={ref} {...props}>{children}</button>),
    svg: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <svg ref={ref} {...props}>{children}</svg>),
    span: forwardRef(({ children, whileHover, layout, initial, animate, variants, transition, ...props }, ref) => <span ref={ref} {...props}>{children}</span>),
  };
  const AnimatePresence = ({ children }) => <>{children}</>;
  const animate = jest.fn((from, to, options) => {
    if (options && options.onUpdate) {
      options.onUpdate(to);
    }
    return mockAnimateControls; // Return the globally defined mock controls
  });

  const resetFramerMotionMocks = () => {
    animate.mockClear();
    mockAnimateControls.stop.mockClear();
  };

  return {
    motion,
    AnimatePresence,
    animate,
    __esModule: true, // Important for named exports
    mockAnimateControls, // Export the globally defined mock controls
    resetFramerMotionMocks, // Export the reset function
  };
});
