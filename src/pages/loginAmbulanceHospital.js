import React, { useState } from 'react';
import axios from 'axios';

const LoginAmbulanceHospital = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // Get the role from local storage
  const role = localStorage.getItem('userRole') || 'ambulance'; // Default to 'ambulance' if not set

  const handleLogin = async (e) => {
    e.preventDefault();

    const body = {
      role,
      id,
      password
    };

    try {
      const response = await axios.post('/login', body); // Use the correct endpoint
      const { statusCode, message, access_token, refresh_token } = response.data;

      if (statusCode === 200) {
        console.log(message); // "로그인 성공"
        // Store tokens (optional)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
      } else {
        console.log(message); // Handle error cases (404, 510, etc.)
      }
    } catch (error) {
      console.error('Login request failed', error); // Log error message
    }
  };

  return (
    <div>
      <h1>{role === 'ambulance' ? 'Ambulance Personnel' : 'Hospital Doctor'} Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginAmbulanceHospital;
