import axios from 'axios';

/**
 * Base URL for the API.
 * Adjust this if your backend runs on a different URL or port.
 */
const API_URL = 'http://localhost:5005';

/**
 * Axios instance configured with the base URL.
 * Includes a request interceptor to attach the authorization token.
 */
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Request interceptor to include the authentication token in headers.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Store token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Authentication API call to log in a user.
 *
 */
export const login = (email, password) => api.post('/admin/auth/login', { email, password });

/**
 * Authentication API call to register a new user.
 *
 */
export const register = (email, password, name) => api.post('/admin/auth/register', { email, password, name });

/**
 * Authentication API call to log out the current user.
 *
 */
export const logout = () => api.post('/admin/auth/logout');

/**
 * Fetches the store data for the authenticated user.
 *
 */
export const getStore = () => api.get('/store');

/**
 * Updates the store data for the authenticated user.
 *
 */
export const setStore = (storeData) => api.put('/store', { store: storeData });

export default api;
