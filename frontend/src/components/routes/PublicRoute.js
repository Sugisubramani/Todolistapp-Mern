import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  return state.isAuthenticated ? <Navigate to="/todos" /> : children;
};

export default PublicRoute;
