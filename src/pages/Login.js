import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hospital');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/login/${role}`, { id, password });

      if (response.data.statusCode === 200) {
        if (response.data.approved || role === 'admin') {
          setSuccess('로그인 성공!');
          setError('');
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'hospital') {
            navigate('/hospital/dashboard');
          } else if (role === 'ambulance') {
            navigate('/ambulance/dashboard');
          }
        } else {
          setError('계정 승인이 필요합니다.');
          setSuccess('');
        }
      } else {
        setError('로그인 실패: ID 또는 비밀번호를 확인하세요.');
        setSuccess('');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setSuccess('');
    }
  };

  return (
      <FormContainer>
        <h1>로그인</h1>
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

          <div>
            <label>
              <input
                  type="radio"
                  value="hospital"
                  checked={role === 'hospital'}
                  onChange={() => setRole('hospital')}
              />
              병원
            </label>
            <label>
              <input
                  type="radio"
                  value="ambulance"
                  checked={role === 'ambulance'}
                  onChange={() => setRole('ambulance')}
              />
              구급대
            </label>
            <label>
              <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
              />
              관리자
            </label>
          </div>

          <Button type="submit" primary>로그인</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </FormContainer>
  );
};

export default Login;
