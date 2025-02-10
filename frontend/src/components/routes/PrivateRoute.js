import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  // If user is authenticated, render the child component.
  // Otherwise, redirect to /register.
  return state.isAuthenticated ? children : <Navigate to="/register" />;
};

export default PrivateRoute;
