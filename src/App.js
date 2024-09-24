import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import LoginAdmin from './pages/loginAdmin';
import LoginAmbulance from './pages/loginAmbulance';
import LoginHospital from './pages/loginHospital';
import SignupAdmin from './pages/SignupAdmin';
import SignupAmbulance from './pages/SignupAmbulance';
import SignupHospital from './pages/SignupHospital';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/ambulance" element={<LoginAmbulance />} />
        <Route path="/login/hospital" element={<LoginHospital />} />
        <Route path="/signup/admin" element={<SignupAdmin />} />
        <Route path="/signup/ambulance" element={<SignupAmbulance />} />
        <Route path="/signup/hospital" element={<SignupHospital />} />
      </Routes>
    </Router>
  );
};

export default App;
