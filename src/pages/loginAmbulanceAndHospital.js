import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const LoginAmbulanceAndHospital = () => {
  const [role, setRole] = useState('ambulance');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { role, id, password });
      if (response.data.statusCode === 200) {
        setSuccess('로그인 성공');
      } else {
        setError('로그인 실패');
      }
    } catch (err) {
      setError('로그인 실패');
    }
  };

  return (
    <FormContainer>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Role (ambulance or hospital)" value={role} onChange={(e) => setRole(e.target.value)} required />
        <Input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" primary>Login</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <p>Already have an account? <a href="/signup/ambulance">Sign up</a></p>
      </form>
    </FormContainer>
  );
};

export default LoginAmbulanceAndHospital;
