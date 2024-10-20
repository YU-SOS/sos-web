import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FormContainer, Input, Button} from '../../components/StyledComponents';
import axios from 'axios';
import signupHospitalAPI from "../../api/signup/signupHospitalAPI";
import {Map} from "react-kakao-maps-sdk";
import useKakaoLoader from "../../api/signup/useKakaoLoader";
import {ToastContainer, toast} from 'react-toastify';
import {storage} from "../../firebase";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import 'react-toastify/dist/ReactToastify.css';

const SignupHospital = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 미리보기 상태
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    try {
      const downloadURL = await uploadImage();
      const result = await signupHospitalAPI({
        id,
        password,
        name,
        address,
        telephoneNumber,
        imageUrl: downloadURL,
        location: {latitude, longitude},
        categories,
      });

      if (result.status === 201) {
        alert('가입 신청이 완료되었습니다.');
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error('회원가입 실패.');
      }
    } catch (error) {
      toast.error('회원가입 중 오류 발생.');
      console.error(error);
    }
  };

  {/* 지도 사용 */}
  useKakaoLoader();
  const [map, setMap] = useState({
    center: {lat: 35.8358302, lng: 128.7521449},
    isPanto: true,
  });

  const ps = new window.kakao.maps.services.Places();

  const SearchMap = () => {
    const placesSearchCB = (data, map, pagination) => {
      if (map === window.kakao.maps.services.Status.OK) {
        const newSearch = data[0];
        setMap({center: {lat: newSearch.y, lng: newSearch.x}});
        setLatitude(newSearch.y);
        setLongitude(newSearch.x);
      }
    };
    ps.keywordSearch(address, placesSearchCB);
  };

  {/* 아이디 중복 체크 */}
  const handleCheckId = async () => {
    try {
      const response = await axios.get('http://api.yu-sos.co.kr:8080/dup-check', {
        params: { id, role: 'HOS' },
      });

      if (response.data.status === 200) {
        toast.success('사용 가능한 아이디입니다.');
      } else {
        toast.error('이미 사용 중인 아이디입니다.');
      }
    } catch (error) {
      console.error('ID 중복 확인 오류:', error);
      toast.error('ID 중복 확인 중 오류가 발생했습니다.');
    }
  };

  {/* 대표 이미지 선택 및 미리보기 */}
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = () => {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setIsUploading(true);

    return new Promise((resolve, reject) => {
      uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error("이미지 업로드 중 오류:", error);
            toast.error("이미지 업로드 실패.");
            setIsUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            toast.success("이미지 업로드 성공.");
            setIsUploading(false);
            resolve(downloadURL);
          }
      );
    });
  };

  const inputStyle = {
    width: '100%',
    height: '40px',
    marginBottom: '5px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '90px',
    height: '40px',
  };

  return (
      <FormContainer>
        <h1>병원 회원가입</h1>
        <form onSubmit={handleSubmit} style={{width: '500px', margin: '0 auto'}}>
          <div style={{display: 'flex', marginBottom: '5px'}}>
            <Input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                style={{flex: 1, marginRight: '5px', ...inputStyle}}
            />
            <Button type="button" onClick={handleCheckId} style={buttonStyle}>
              중복확인
            </Button>
          </div>
          <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
          />
          <Input
              type="text"
              placeholder="병원 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
          />
          <div style={{display: 'flex', marginBottom: '5px'}}>
            <Input
                type="text"
                placeholder="주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{flex: 1, marginRight: '5px', ...inputStyle}}
            />
            <Button type="button" onClick={SearchMap} style={buttonStyle}>
              검색
            </Button>
          </div>

          <Map
              center={map.center}
              isPanto={map.isPanto}
              style={{width: '100%', height: '350px', marginBottom: '5px'}}
              level={3}
              onClick={(_, mouseEvent) => {
                const latlng = mouseEvent.latLng;
                setLatitude(latlng.getLat());
                setLongitude(latlng.getLng());
              }}
          />
          <Input
              type="text"
              placeholder="위도"
              value={latitude}
              readOnly
              required
              disabled
              style={inputStyle}
          />
          <Input
              type="text"
              placeholder="경도"
              value={longitude}
              readOnly
              required
              disabled
              style={inputStyle}/>
          <Input
              type="text"
              placeholder="전화번호"
              value={telephoneNumber}
              onChange={(e) => setTelephoneNumber(e.target.value)}
              required
              style={inputStyle}
          />
          <Input
              type="text"
              placeholder="카테고리 (쉼표로 구분)"
              value={categories}
              onChange={(e) => setCategories(e.target.value.split(','))}
              required
              style={inputStyle}
          />
          <div
              style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
            <div style={{flex: 1}}>
              <p style={{fontSize: '14px', marginBottom: '5px'}}>대표 이미지 설정</p>
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    marginBottom: '5px',
                  }}
              />
            </div>
            <div
                style={{
                  width: '120px',
                  height: '120px',
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '15px',
                  overflow: 'hidden',
                }}
            >
              {imagePreview ? (
                  <img
                      src={imagePreview}
                      alt="미리보기"
                      style={{width: '120px', height: '120px'}}
                  />
              ) : (
                  <p style={{fontSize: '12px', color: '#aaa'}}>미리보기</p>
              )}
            </div>
          </div>
          <Button
              type="submit"
              primary style={{width: '100%', padding: '15px', fontSize: '18px'}}>
            회원가입
          </Button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick/>
      </FormContainer>
  );
};

export default SignupHospital;
