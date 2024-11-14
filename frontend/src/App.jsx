import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PresentationPage from './pages/PresentationPage';
import PresentationPreview from './components/PresentationPreview';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { CssBaseline } from '@mui/material';
import CustomThemeProvider from './context/ThemeContext';

/**
 * App component that sets up the routing and theming for the application.
 * Includes the Navbar and defines routes for various pages.
 */
const App = () => {
  return (
    <CustomThemeProvider>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Navbar />
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
    </CustomThemeProvider>
  );
};

export default App;
