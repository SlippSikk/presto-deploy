import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

/**
 * Entry point of the React application.
 * Wraps the App component with StrictMode, BrowserRouter, and AuthProvider.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </AuthProvider>
  </BrowserRouter>
);
