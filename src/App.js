import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import Login from './pages/login/Login';
import SignupHospital from './pages/signup/SignupHospital';
import AdminDashboard from './admin/page/AdminDashboard.js';
import AdminLayout from './admin/layout/AdminLayout';
import HospitalDashboard from './hospital/page/HospitalDashboard'
import HospitalLayout from './hospital/layout/HospitalLayout';
import GlobalStyle from './GlobalStyle.js';
import RegistrationList from "./admin/page/AdminDashboardRegistrationList";
import List from "./hospital/page/List";
import Reception from "./hospital/page/Reception";
import Request from "./hospital/page/Request";
import Profile from "./hospital/page/HospitalProfile";

const App = () => {
    return (
        <>
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup/hospital" element={<SignupHospital />} />

                <Route path='/admin' element ={ <AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="registration-list" element={<RegistrationList />} />
                </Route>

                <Route path='/hospital' element ={ <HospitalLayout />}>
                    <Route path='dashboard' element={ <HospitalDashboard />} />
                    <Route path='profile' element={ <Profile />} />
                    <Route path='list' element={ <List /> } />
                    <Route path='reception' element={ <Reception /> } />
                    <Route path='request' element={ <Request /> } />
                </Route>
            </Routes>
        </Router>
        </>
    );
};

export default App;
