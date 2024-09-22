import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents'; 
import axios from 'axios';

const LoginGeneralUser = () => {
  const [name, setName] = useState('');
  const [providerId, setProviderId] = useState('');
  const [provider] = useState('kakao');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login/user', { name, providerId, provider, email });
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
      <h1>일반 유저 로그인</h1>
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="text" placeholder="카카오 앱 내 유저 고유번호" value={providerId} onChange={(e) => setProviderId(e.target.value)} required />
        <Input type="text" placeholder="Provider" value={provider} disabled />
        <Input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" primary>Login</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </FormContainer>
  );
};

export default LoginGeneralUser;
