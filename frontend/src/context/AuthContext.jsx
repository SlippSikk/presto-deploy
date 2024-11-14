import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, register as registerAPI, logout as logoutAPI, getStore } from '../services/api';
import PropTypes from 'prop-types';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle async token verification
  const [error, setError] = useState('');
  console.log(setError);

  /**
   * Verifies the token's validity by fetching store data.
   * If successful, sets the user as authenticated.
   * Otherwise, clears the token and redirects to login.
   */
  useEffect(() => {
    const verifyToken = async () => {
      if (auth.token) {
        try {
          // Attempt to fetch store data to verify token
          const response = await getStore();
          if (response.status === 200) {
            setIsAuthenticated(true);
            setAuth((prev) => ({ ...prev, user: response.data.user || null })); // Assuming user data is returned
          } else {
            throw new Error('Token verification failed');
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          setIsAuthenticated(false);
          setAuth({ token: null, user: null });
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyToken();
     
  }, []);

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
      setAuth({ token: response.data.token, user: response.data.user || null });
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
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
      setAuth({ token: response.data.token, user: response.data.user || null });
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
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
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setAuth({ token: null, user: null });
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
