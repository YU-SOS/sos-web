import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import LoginGeneral from './pages/loginGeneral';
import LoginAmbulanceHospital from './pages/loginAmbulanceHospital'; // Ensure this import is added

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login/general" element={<LoginGeneral />} />
        <Route path="/login" element={<LoginAmbulanceHospital />} /> {/* Updated route */}
      </Routes>
    </Router>
  );
};

export default App;
