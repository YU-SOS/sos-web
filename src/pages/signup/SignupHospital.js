import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import axios from 'axios';
import signupHospitalAPI from "../../api/signup/signupHospitalAPI";

const SignupHospital = () => {
  const navigate = useNavigate();
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signupHospitalAPI({
        id,
        password,
        name,
        address,
        telephoneNumber,
        imageUrl,
        location: {
          latitude,
          longitude
        },
        categories
      });

      if (result.status === 200) {
        setSuccess('가입 신청이 성공적으로 완료되었습니다. 관리자의 승인을 기다려 주세요.');
        setError('');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
        setSuccess('');
      }

    } catch (e) {
      console.error(e);
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(e);
    }
  };

  return (
    <FormContainer>
      <h1>병원 회원가입</h1>
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
        <Input
          type="text"
          placeholder="병원 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="전화번호"
          value={telephoneNumber}
          onChange={(e) => setTelephoneNumber(e.target.value)}
          required
        />
        <Input
          type="url"
          placeholder="대표사진 URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Input
          type="text"
          placeholder="위도"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="경도"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="카테고리 (쉼표로 구분)"
          value={categories}
          onChange={(e) => setCategories(e.target.value.split(','))}
          required
        />
        <Button type="submit" primary>회원가입</Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </FormContainer>
  );
};

export default SignupHospital;
