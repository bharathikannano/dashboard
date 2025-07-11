import React from 'react';

// Mock ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

// Mock App component
jest.mock('./App', () => {
  const MockApp = () => <div data-testid="mock-app">Mock App</div>;
  return MockApp;
});

describe('index.js', () => {
  let ReactDOM;
  let App;
  let root;
  let renderApp;

  beforeEach(() => {
    jest.resetModules();
    // Re-import after resetting modules to get fresh mocks
    ReactDOM = require('react-dom/client');
    App = require('./App');
    // Set up root element
    let rootElement = document.getElementById('root');
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
    }
    // Import index.js after mocks and DOM setup
    const index = require('./index');
    root = index.root;
    renderApp = index.renderApp;
  });

  afterEach(() => {
    // Clean up root element
    const rootElement = document.getElementById('root');
    if (rootElement) rootElement.remove();
  });

  it('should create root with the correct element', () => {
    const rootElement = document.getElementById('root');
    renderApp();
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('should render App within StrictMode', () => {
    renderApp();
    const renderCall = root.render.mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children.type).toBe(App);
  });

  it('should only create root once', () => {
    renderApp();
    renderApp();
    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
  });

  it('should re-render when renderApp is called multiple times', () => {
    renderApp();
    renderApp();
    expect(root.render).toHaveBeenCalledTimes(2);
  });
});
