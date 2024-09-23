import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../components/StyledComponents';
import axios from 'axios';

const SignupHospital = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(''); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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
      const response = await axios.post('/signup/hospital', {
        role: 'hospital',
        id,
        password,
        name,
        latitude,
        longitude,
        approved: false // 승인대기상태
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
        <h1>병원 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <Input
              type="text"
              placeholder="아이디"
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
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
          />
          <Input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
          />
          <Input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
          />
          <Button type="submit" primary>회원가입 신청</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
        <p>이미 계정이 있으신가요? <a href="/login/hospital">로그인</a></p>
      </FormContainer>
  );
};

export default SignupHospital;
