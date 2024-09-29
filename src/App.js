import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import LoginAdmin from './pages/loginAdmin';
import LoginAmbulance from './pages/loginAmbulance';
import LoginHospital from './pages/loginHospital';
import SignupAdmin from './pages/SignupAdmin';
import SignupAmbulance from './pages/SignupAmbulance';
import SignupHospital from './pages/SignupHospital';
import Layout from './layout/Layout';
import Reqeust from './pages/hospital/Reqeust';
import Reception from './pages/hospital/Reception';
import Test from './Test';

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
        <Route path="/test2" element={<Test />} />

        <Route path='/test' element ={<Layout />}>
          <Route path='request' element={<Reqeust/>} />
          <Route path='reception' element={<Reception/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
