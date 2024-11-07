import axios from 'axios';

const API_URL = 'http://localhost:5005/admin/auth'; // Adjust if your backend runs elsewhere

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
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

// Authentication functions
export const login = (email, password) => api.post('/login', { email, password });
export const register = (email, password, name) => api.post('/register', { email, password, name });
export const logout = () => api.post('/logout');

export default api;
