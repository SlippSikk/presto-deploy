import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, register as registerAPI, logout as logoutAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null, // You can store user details here if available
  });

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
