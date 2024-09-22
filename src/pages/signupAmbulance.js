import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const SignupAmbulance = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/signup', { role: 'ambulance', id, password, name, phoneNumber, address });
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
      <h1>Sign Up for Ambulance Personnel</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Button type="submit" primary>Sign Up</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </FormContainer>
  );
};

export default SignupAmbulance;
