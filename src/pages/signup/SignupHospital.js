import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import axios from 'axios';
import signupHospitalAPI from "../../api/signup/signupHospitalAPI";
import { Map } from "react-kakao-maps-sdk"
import useKakaoLoader from "../../api/signup/useKakaoLoader"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  useKakaoLoader()
  const [map, setMap] = useState({
    center: { lat: 35.8358302, lng: 128.7521449 },
    isPanto: true,
  })
  const ps = new window.kakao.maps.services.Places()

  const SearchMap = () => {
    const placesSearchCB = function(data, map, pagination) {
      if (map === window.kakao.maps.services.Status.OK) {
        const newSearch = data[0]
        setMap({
          center: { lat: newSearch.y, lng: newSearch.x }
        })
        setLatitude(newSearch.y);
        setLongitude(newSearch.x);
      }
    };
    ps.keywordSearch(`${address}`, placesSearchCB);
  }

  const handleCheckId = async () => {
    try {
      const response = await axios.get(`http://3.35.136.82:8080/dup-check`, {
        params: {
          id: id,
          role: 'HOS',
        },
      });

      if (response.data.status === 200) {
        toast.success('사용가능한 아이디입니다.');
        setError('');
        return true;
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('이미 사용 중인 아이디입니다.');
        setSuccess('');
        return false;
      } else {
        toast.error('ID 중복 확인 중 오류가 발생했습니다.');
        setSuccess('');
        console.error(error);
        return false;
      }
    }
  };

  const checkId = async () => {
    try {
      const response = await axios.get(`http://3.35.136.82:8080/dup-check`, {
        params: {
          id: id,
          role: 'HOS',
        },
      });
      return response.data.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const isIdAvailable = await checkId();

    if (!isIdAvailable) {
      return;
    }

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
          longitude,
        },
        categories,
      });

      if (result.status === 201) {
        alert('가입 신청이 성공적으로 완료되었습니다. 관리자의 승인을 기다려 주세요.');
        setError('');
        setTimeout(() => navigate('/'), 1000);
      } else {
        console.log(result.status)
        toast.error('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
        setSuccess('');
      }
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSuccess('');
      console.error(error);
    }
  };


  return (
      <FormContainer>
        <h1>병원 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                style={{width: '405px'}}
            />
            <Button
                type="button"
                onClick={handleCheckId}
                style={{width: '90px'}}
            >
              중복확인
            </Button>
          </div>
          <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '500px'}}
              required
          />
          <Input
              type="text"
              placeholder="병원 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{width: '500px'}}
          />
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Input
                type="text"
                placeholder="주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{width: '425px'}}
            />
            <Button
                type="button"
                onClick={SearchMap}
                style={{width: '70px'}}
            >검색</Button>
          </div>
          <Map
              id="map"
              center={map.center}
              isPanto={map.isPanto}
              style={{
                width: "100%",
                height: "350px",
              }}
              level={3}
              onClick={(_, mouseEvent) => {
                const latlng = mouseEvent.latLng;
                setLatitude(latlng.getLat());
                setLongitude(latlng.getLng());
              }}
          />
          <p style={{color: 'green', fontSize: '12px', marginTop: '5px'}}>
            * 지도를 클릭하여 정확한 위치를 지정하세요
          </p>
          <Input
              type="text"
              placeholder="위도"
              value={latitude}
              readOnly
              disabled
              required
              style={{width: '500px'}}
          />
          <Input
              type="text"
              placeholder="경도"
              value={longitude}
              readOnly
              disabled
              required
              style={{width: '500px'}}
          />
          <Input
              type="text"
              placeholder="전화번호"
              value={telephoneNumber}
              onChange={(e) => setTelephoneNumber(e.target.value)}
              required
              style={{width: '500px'}}
          />
          <Input
              type="url"
              placeholder="대표사진 URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{width: '500px'}}
          />

          <Input
              type="text"
              placeholder="카테고리 (쉼표로 구분)"
              value={categories}
              onChange={(e) => setCategories(e.target.value.split(','))}
              required
              style={{width: '500px'}}
          />
          <Button
              type="submit"
              primary
          >회원가입</Button>
          {error && <p style={{color: 'red'}}>{error}</p>}
          {success && <p style={{color: 'green'}}>{success}</p>}
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick/>
      </FormContainer>
  );
};

export default SignupHospital;
