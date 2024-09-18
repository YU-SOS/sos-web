import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const SignupHospital = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signup', { role: 'hospital', id, password, name, latitude, longitude });
      if (response.data.statusCode === 200) {
        setSuccess('회원가입 성공');
      } else {
        setError('회원가입 실패');
      }
    } catch (err) {
      setError('회원가입 실패');
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up for Hospital</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
        <Input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
        <Button type="submit" primary>Sign Up</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </FormContainer>
  );
};

export default SignupHospital;
