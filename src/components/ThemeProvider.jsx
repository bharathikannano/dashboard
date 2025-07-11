import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Create a context for theme management
const ThemeContext = createContext({
  theme: 'system',
  setTheme: (theme) => {},
  isDarkMode: false,
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const validThemes = ['system', 'light', 'dark'];

  // Utility functions
  const getSystemIsDark = () => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  };

  const resolveTheme = (t) => validThemes.includes(t) ? t : 'system';
  
  // State for theme and dark mode
  const [theme, setThemeState] = useState(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined' &&
        typeof window.localStorage.getItem === 'function'
      ) {
        const stored = window.localStorage.getItem('theme');
        return resolveTheme(stored);
      }
    } catch {}
    return 'system';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const currentTheme = resolveTheme(theme);
    return currentTheme === 'system' ? getSystemIsDark() : currentTheme === 'dark';
  });
  
  // Check for SSR/missing APIs once and store the result
  const [hasBrowserFeatures] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      return !!(
        window.document?.documentElement?.classList?.remove &&
        window.document?.documentElement?.classList?.add &&
        typeof window.matchMedia === 'function'
      );
    } catch {
      return false;
    }
  });

  // Effect to apply the theme and listen for system changes
  useEffect(() => {
    if (!hasBrowserFeatures) return;

    const root = window.document.documentElement;
    const newTheme = resolveTheme(theme);
    const systemIsDark = getSystemIsDark();
    const newIsDarkMode = newTheme === 'system' ? systemIsDark : newTheme === 'dark';
    
    setIsDarkMode(newIsDarkMode);
    root.classList.remove('light', 'dark');
    root.classList.add(newIsDarkMode ? 'dark' : 'light');

    let mediaQuery;
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }

    const handleChange = (e) => {
      const matches = e?.matches ?? getSystemIsDark();
      if (resolveTheme(theme) === 'system') {
        setIsDarkMode(matches);
        root.classList.remove('light', 'dark');
        root.classList.add(matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, hasBrowserFeatures]);

  // Wrapper for setTheme to also persist to localStorage
  const setTheme = useCallback((newTheme) => {
    const valid = resolveTheme(newTheme);
    try {
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('theme', valid);
      }
    } catch {}
    setThemeState(valid);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
