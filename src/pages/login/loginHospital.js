import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import loginHospitalAPI from '../../api/login/loginHospitalAPI';

const LoginHospital = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginHospitalAPI({
        id,
        password,
        role
      });

      if (result.statusCode === 200) {
        setSuccess('로그인 성공!');
        setError('');
        localStorage.setItem('HospitalDoctorLoggedIn', true);
        navigate('/hospital/dashboard');
      } else if (result.statusCode === 403) {
        const userId = result.userId; 
        setError(`블랙리스트된 사용자입니다. 사용자 ID: ${userId}`);
      } else if (result.statusCode === 404) {
        setError('사용자 조회 불가. ID 또는 비밀번호를 확인하세요.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
        setSuccess('');
      }
    } catch (e) {
      console.error(e);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <FormContainer>
      <h1>병원 로그인</h1>
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
      </form>
    </FormContainer>
  );
};

export default LoginHospital;
