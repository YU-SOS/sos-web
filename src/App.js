import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignupAdmin from './pages/SignupAdmin';
import SignupAmbulance from './pages/SignupAmbulance';
import SignupHospital from './pages/SignupHospital';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup/admin" element={<SignupAdmin />} />
                <Route path="/signup/ambulance" element={<SignupAmbulance />} />
                <Route path="/signup/hospital" element={<SignupHospital />} />
            </Routes>
        </Router>
    );
};
//
export default App;
