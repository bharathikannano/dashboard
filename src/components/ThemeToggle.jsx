import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

  // Apply theme class to document when component mounts or theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-7 rounded-full bg-secondary p-1 shadow-md"
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="absolute inset-0 flex items-center justify-between px-1 w-full h-full">
        {/* Sun icon */}
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-yellow-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          initial={{ opacity: isDarkMode ? 1 : 0 }}
          animate={{ opacity: isDarkMode ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </motion.svg>
        {/* Moon icon */}
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-blue-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          initial={{ opacity: isDarkMode ? 0 : 1 }}
          animate={{ opacity: isDarkMode ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </motion.svg>
      </div>
      {/* Toggle circle */}
      <motion.div 
        className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md z-10"
        style={{ left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
