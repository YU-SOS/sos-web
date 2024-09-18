import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import LoginAmbulanceAndHospital from './pages/loginAmbulanceAndHospital';
import LoginGeneralUser from './pages/loginGeneralUser';
import SignupAmbulance from './pages/signupAmbulance';
import SignupHospital from './pages/signupHospital';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login/general" element={<LoginGeneralUser />} />
        <Route path="/login" element={<LoginAmbulanceAndHospital />} />
        <Route path="/signup/ambulance" element={<SignupAmbulance />} />
        <Route path="/signup/hospital" element={<SignupHospital />} />
      </Routes>
    </Router>
  );
};

export default App;
