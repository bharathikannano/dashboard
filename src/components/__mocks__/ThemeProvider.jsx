import React from 'react';

const ThemeProvider = ({ children }) => (
  <div data-testid="theme-provider">{children}</div>
);

export default ThemeProvider;
