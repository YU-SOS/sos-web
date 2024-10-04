import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import axios from 'axios';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', {
        id,
        password,
      });

      if (response.data.status === 'success') {
        setSuccess('로그인 성공!');
        setError('');
        navigate('/admin/dashboard');
      } else {
        setError('로그인에 실패했습니다. ID 또는 비밀번호를 확인하세요.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  return (
      <FormContainer>
        <h1>관리자 로그인</h1>
        <form onSubmit={handleSubmit}>
          <Input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
          />
          <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <Button type="submit" primary>로그인</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </FormContainer>
  );
};

export default LoginAdmin;