import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isVerified: boolean;
  verificationPath?: string;
}

function PrivateRoute({ children, isAuthenticated, isVerified, verificationPath = '/verification-pending' }: PrivateRouteProps) {
  const location = useLocation();

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    // Redirect to verification pending page if not verified
    return <Navigate to={verificationPath} state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;