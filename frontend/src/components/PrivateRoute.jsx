import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requireAdmin = false, requireSeller = false }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    if (requireSeller) return <Navigate to="/seller/login" state={{ from: location }} replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireSeller && role !== 'seller') {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};

export default PrivateRoute;
