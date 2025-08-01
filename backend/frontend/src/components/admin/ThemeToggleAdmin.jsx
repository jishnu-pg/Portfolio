import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggleAdmin = ({ collapsed }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center w-full h-7 rounded-full px-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
      style={{ minWidth: 0 }}
    >
      {/* Light (Sun Outline) Icon - left edge */}
      <span
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 pointer-events-none ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
        style={{ zIndex: 2 }}
      >
        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      {/* Dark (Moon Outline) Icon - right edge */}
      <span
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 pointer-events-none ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 2 }}
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      </span>
      {/* Toggle Text + Icon (center) */}
      <span
        className={`absolute left-1/2 top-1/2 flex items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 text-xs font-semibold select-none transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}
        style={{ zIndex: 4 }}
      >
        {!isDarkMode && (
          <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
        {isDarkMode ? 'Dark' : 'White'}
        {isDarkMode && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </span>
      {/* Toggle Knob */}
      <span
        className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 bg-white border border-gray-300 dark:border-gray-600 shadow w-5 h-5 rounded-full`}
        style={{ left: isDarkMode ? 'calc(100% - 1.75rem)' : '0.25rem', zIndex: 3 }}
      ></span>
    </button>
  );
};

export default ThemeToggleAdmin; 