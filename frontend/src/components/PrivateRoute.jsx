import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PrivateRoute component that restricts access to authenticated users.
 *
 * @param {object} props - React props.
 * @param {React.ReactNode} props.children - Child components to render if authenticated.
 * @returns {JSX.Element} Either the child components or a Navigate component to redirect to login.
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth.token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
