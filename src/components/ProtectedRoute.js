import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('HospitalDoctorLoggedIn');

  return isAuthenticated ? children : <Navigate to="/login/hospital" />;
};

export default ProtectedRoute;
