import React, { useState } from 'react';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const SignupAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/signup/admin', {
        name,
        email,
        password,
        role: 'admin',
      });

      if (response.data.status === 'success') {
        setSuccess('회원가입 신청이 완료되었습니다. 관리자의 승인을 기다리세요.');
        setError('');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  return (
      <FormContainer>
        <h1>관리자 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <Input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
          />
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
          <Button type="submit" primary>회원가입 신청</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </FormContainer>
  );
};

export default SignupAdmin;
