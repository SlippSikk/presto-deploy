// src/components/__tests__/Navbar.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('Navbar Component', () => {
    const renderNavbar = (authValue) => {
      render(
        <AuthContext.Provider value={authValue}>
          <Router>
            <Navbar />
          </Router>
        </AuthContext.Provider>
      );
    };
  
    it('renders Navbar with Presto title', () => {
      renderNavbar({ auth: {}, logout: vi.fn() });
      const titleElement = screen.getByText(/Presto/i);
      expect(titleElement).toBeInTheDocument();
    });
  
    it('shows Home, Login, Register links when not authenticated', () => {
      renderNavbar({ auth: { token: null }, logout: vi.fn() });
      expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Register/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
    });
  
    it('shows Dashboard link and Logout button when authenticated', () => {
      const mockLogout = vi.fn();
      renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout });
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Home/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Register/i })).not.toBeInTheDocument();
    });
  
    it('calls logout function when Logout button is clicked', () => {
      const mockLogout = vi.fn();
      renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout });
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  
    it('navigates to correct routes when links are clicked', () => {
      renderNavbar({ auth: { token: null }, logout: vi.fn() });
      const homeLink = screen.getByRole('link', { name: /Home/i });
      const loginLink = screen.getByRole('link', { name: /Login/i });
      const registerLink = screen.getByRole('link', { name: /Register/i });
  
      expect(homeLink).toHaveAttribute('href', '/');
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  
    it('navigates to Dashboard when Dashboard link is clicked', () => {
      const mockLogout = vi.fn();
      renderNavbar({ auth: { token: 'sample_token' }, logout: mockLogout });
      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });
  });