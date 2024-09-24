import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login/admin', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        setSuccess('로그인이 성공적으로 완료되었습니다.');
        setError('');
      } else {
        setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  return (
    <FormContainer>
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <p>계정이 없으신가요? <a href="/signup/admin">회원가입</a></p>
    </FormContainer>
  );
};

export default LoginAdmin;
