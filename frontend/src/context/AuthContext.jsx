import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, register as registerAPI, logout as logoutAPI } from '../services/api';

/**
 * AuthContext provides authentication state and functions to manage authentication.
 */
export const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application and provides authentication context.
 *
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} AuthContext.Provider with authentication state and functions.
 */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null, // You can store user details here if available
  });

  /**
   * Handles user login by calling the login API and updating authentication state.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @throws Will throw an error message if login fails.
   */
  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      localStorage.setItem('token', response.data.token);
      setAuth({ token: response.data.token, user: null });
      navigate('/dashboard');
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  /**
   * Handles user registration by calling the register API and updating authentication state.
   *
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @param {string} name - User's name.
   * @throws Will throw an error message if registration fails.
   */
  const register = async (email, password, name) => {
    try {
      const response = await registerAPI(email, password, name);
      localStorage.setItem('token', response.data.token);
      setAuth({ token: response.data.token, user: null });
      navigate('/dashboard');
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  /**
   * Handles user logout by calling the logout API and clearing authentication state.
   */
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      setAuth({ token: null, user: null });
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
