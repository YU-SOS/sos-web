import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken'); // Check for admin access token
  const isHospitalLoggedIn = localStorage.getItem('HospitalDoctorLoggedIn'); // Check for hospital login

  // Assuming you want to allow both hospital and admin users
  const isAuthenticated = accessToken || isHospitalLoggedIn;

  return isAuthenticated ? children : <Navigate to="/login/hospital" />;
};

export default ProtectedRoute;
