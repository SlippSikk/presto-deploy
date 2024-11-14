import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('Navbar Component', () => {
  const renderNavbar = (authValue, themeValue) => {
    render(
      <AuthContext.Provider value={authValue}>
        <ThemeContext.Provider value={themeValue}>
          <Router>
            <Navbar />
          </Router>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );
  };

  const mockToggleTheme = vi.fn();

  it('renders Navbar with Presto title', () => {
    renderNavbar({ auth: {}, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
    const titleElement = screen.getByText(/Presto/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('shows Home, Login, Register links when not authenticated', () => {
    renderNavbar({ auth: { token: null }, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Register/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  it('shows Dashboard link and Logout button when authenticated', () => {
    const mockLogout = vi.fn();
    renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout }, { mode: 'light', toggleTheme: mockToggleTheme });
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Home/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Register/i })).not.toBeInTheDocument();
  });

  it('calls logout function when Logout button is clicked', () => {
    const mockLogout = vi.fn();
    renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout }, { mode: 'light', toggleTheme: mockToggleTheme });
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('toggles theme when theme button is clicked', () => {
    renderNavbar({ auth: {}, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
    const themeButton = screen.getByRole('button', { name: /Toggle theme/i });
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('navigates to correct routes when links are clicked', () => {
    renderNavbar({ auth: { token: null }, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
    const homeLink = screen.getByRole('link', { name: /Home/i });
    const loginLink = screen.getByRole('link', { name: /Login/i });
    const registerLink = screen.getByRole('link', { name: /Register/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('navigates to Dashboard when Dashboard link is clicked', () => {
    const mockLogout = vi.fn();
    renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout }, { mode: 'light', toggleTheme: mockToggleTheme });
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  it('renders appropriate links when auth object has unexpected structure', () => {
    renderNavbar({ auth: { token: undefined }, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
    expect(screen.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
  });

  it('displays correct theme icon for dark mode', () => {
    renderNavbar({ auth: {}, logout: vi.fn() }, { mode: 'dark', toggleTheme: mockToggleTheme });
    expect(screen.getByLabelText(/Toggle theme/i)).toContainElement(screen.getByTestId('Brightness7Icon'));
  });

  it('handles missing logout function gracefully', () => {
    renderNavbar({ auth: { token: 'sample_token' }, logout: undefined }, { mode: 'light', toggleTheme: mockToggleTheme });
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    // No function to call, but no crash occurs
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('displays correct tooltip for theme toggle button', async () => {
    renderNavbar({ auth: {}, logout: vi.fn() }, { mode: 'dark', toggleTheme: mockToggleTheme });
  
    // Get the theme toggle button
    const themeButton = screen.getByRole('button', { name: /Toggle theme/i });
  
    // Simulate hover or focus on the button to reveal the tooltip
    fireEvent.mouseOver(themeButton);
  
    // Wait for the tooltip text to appear in the DOM
    const tooltip = await screen.findByText('Toggle light/dark theme');
    expect(tooltip).toBeInTheDocument();
  });

  it('displays correct theme icon based on mode', async () => {
    const mockToggleTheme = vi.fn();
    // Render Navbar in light mode
    renderNavbar({ auth: {}, logout: vi.fn() }, { mode: 'light', toggleTheme: mockToggleTheme });
  
    // Check for Brightness4 icon (light mode icon)
    const lightModeIcon = screen.getByTestId('Brightness4Icon');
    expect(lightModeIcon).toBeInTheDocument();
    expect(screen.queryByTestId('Brightness7Icon')).not.toBeInTheDocument();
  });

});
