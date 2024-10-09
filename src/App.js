import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import LoginAdmin from './pages/login/loginAdmin';
import LoginHospital from './pages/login/loginHospital';
import SignupHospital from './pages/signup/SignupHospital';
import Layout from './layout/Layout';
import Reqeust from './pages/hospital/Reqeust';
import Reception from './pages/hospital/Reception';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/dashboard/adminDashboard'; 
import HospitalDashboard from './pages/dashboard/HospitalDashboard';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login" element={<LoginHospital />} />
        <Route path="/signup/hospital" element={<SignupHospital />} />

        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/hospital/dashboard" 
          element={
            <ProtectedRoute>
              <HospitalDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/test' 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path='request' element={<Reqeust />} />
          <Route path='reception' element={<Reception />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
