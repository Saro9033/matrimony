import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginAuthStatus, loginAuthUser, loginIsAuthenticated } from '../slices/authSlice';

const ProtectedRoute = ({ children, isAdmin, isUser }) => {
  const isAuthenticated = useSelector(loginIsAuthenticated);
  const authStatus = useSelector(loginAuthStatus);
  const user = useSelector(loginAuthUser);

  
  if (isUser && user?.role === 'user') {
    if(!user.city && !user.coutry & !user.DOB){
      return <Navigate to="/register-form" />;
    }
  }

  if (isUser && user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
  }

  if (!isAuthenticated && !authStatus === "loading") {
    return <Navigate to="/" />;
  }

  if (isAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default React.memo(ProtectedRoute);
