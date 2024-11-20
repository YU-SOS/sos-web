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
import AdminDashboard from './pages/dashboard/AdminDashboard';
import HospitalDashboard from './pages/dashboard/HospitalDashboard';
import HospitalInfoPage from './pages/hospital/HospitalInfoPage'; // 병원 정보 관리 페이지
import EmergencyStatusPage from './pages/hospital/EmergencyStatusPage'; // 응급실 상태 관리 페이지
import EmergencyReceptionPage from './pages/hospital/EmergencyReceptionPage'; // 응급실 방문 신청 목록 페이지
import ReceptionDetails from './pages/reception/ReceptionDetails';
import List from './pages/hospital/List';
import Dashboard from './admin/page/Dashboard.js';
import AdminLayout from './admin/layout/AdminLayout';
import GlobalStyle from './GlobalStyle.js';

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login/admin" element={<LoginAdmin />} />
                    <Route path="/login" element={<LoginHospital />} />
                    <Route path="/signup/hospital" element={<SignupHospital />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="" element={<Dashboard />} />
                    </Route>

                    <Route
                        path="/admin/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Hospital Dashboard Routes */}
                    <Route
                        path="/hospital/dashboard"
                        element={
                            <ProtectedRoute>
                                <HospitalDashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="info" element={<HospitalInfoPage />} />
                        <Route path="emergency-status" element={<EmergencyStatusPage />} />
                        <Route path="emergency-reception" element={<EmergencyReceptionPage />} />
                    </Route>

                    {/* Test Routes */}
                    <Route
                        path="/test"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="request" element={<Reqeust />} />
                        <Route path="reception" element={<Reception />} />
                        <Route path="reception/:receptionId" element={<ReceptionDetails />} />
                        <Route path="list" element={<List />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
};

export default App;
