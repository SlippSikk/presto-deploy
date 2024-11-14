import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PresentationPage from './pages/PresentationPage';
import PresentationPreview from './components/PresentationPreview';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from './theme'; // We'll create this file next

/**
 * App component that sets up the routing and theming for the application.
 * Includes the Navbar and defines routes for various pages.
 */
const App = () => {
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

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Routes>
        {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/presentation/:id"
          element={
            <PrivateRoute>
              <PresentationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/presentation/:id/preview"
          element={
            <PrivateRoute>
              <PresentationPreview />
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
