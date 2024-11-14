import React, { createContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from '../theme';
import PropTypes from 'prop-types';

/**
 * ThemeContext provides theme-related state and functions to the application.
 */
export const ThemeContext = createContext();

/**
 * CustomThemeProvider component that wraps the application and provides theme data and management functions.
 *
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} ThemeContext.Provider with theme data and management functions.
 */
export const CustomThemeProvider = ({ children }) => {
  // Theme state: 'light' or 'dark'
  const [mode, setMode] = useState('light');

  // On mount, check localStorage for theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('preferredTheme');
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  // Toggle theme mode and save preference to localStorage
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('preferredTheme', newMode);
      return newMode;
    });
  };

  // Memoize the theme to prevent unnecessary recalculations
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Context value
  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      theme,
    }),
    [mode, toggleTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

CustomThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomThemeProvider;
