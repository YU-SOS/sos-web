import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const SignupAmbulance = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [ambulanceName, setAmbulanceName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  const handleIdCheck = async () => {
    if (!id) {
      alert('ID를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('/signup/check-id', { id });
      if (response.data.isAvailable) {
        setIsIdAvailable(true);
        alert('사용 가능한 ID입니다.');
      } else {
        setIsIdAvailable(false);
        alert('이미 사용 중인 ID입니다.');
      }
      setIsIdChecked(true);
    } catch (error) {
      setError('오류 : ID 중복 체크 단계');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdChecked || !isIdAvailable) {
      alert('ID 중복 확인을 완료해 주세요.');
      return;
    }

    try {
      const response = await axios.post('/signup/ambulance', {
        role: 'ambulance',
        id,
        password,
        ambulanceName,
        phoneNumber,
        approved: false
      });

      if (response.data.statusCode === 200) {
        setSuccess('회원가입 신청이 완료되었습니다. 관리자의 승인을 기다리세요.');
        setError('');
      } else {
        setError('회원가입 신청에 실패했습니다.');
      }
    } catch (err) {
      setError('회원가입 신청에 실패했습니다.');
    }
  };

  return (
      <FormContainer>
        <h1>구급대 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <Input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setIsIdChecked(false);
              }}
              required
          />
          <Button type="button" onClick={handleIdCheck}>ID 중복 확인</Button>
          <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <Input
              type="text"
              placeholder="구급대명"
              value={ambulanceName}
              onChange={(e) => setAmbulanceName(e.target.value)}
              required
          />
          <Input
              type="text"
              placeholder="대표 전화번호"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
          />
          <Button type="submit" primary>회원가입 신청</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
        <p>이미 계정이 있으신가요? <a href="/login/ambulance">로그인</a></p>
      </FormContainer>
  );
};

export default SignupAmbulance;
