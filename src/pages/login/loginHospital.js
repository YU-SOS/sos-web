import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginHospitalAPI from '../../api/login/loginHospitalAPI';
import '../LoginPage.css';
import SOSLogo from "../SOS_Logo.png";

const LoginHospital = () => {
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginHospitalAPI({
        hospitalId,
        password,
        role: 'HOS'
      });

      if (result.status === 200) {
        alert('로그인 성공! 환영합니다.');
        localStorage.setItem('HospitalDoctorLoggedIn', true);
        navigate('/hospital/dashboard');
      } else if (result.status === 403) {
        toast.error(result.message || '블랙리스트된 사용자입니다.');
      } else if (result.status === 404) {
        toast.error(result.message || '사용자 조회 불가. ID 또는 비밀번호를 확인하세요.');
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      console.error('Error Details:', e.response ? e.response.data : e.message);
      toast.error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const logoStyle = {
    width: '230px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    backgroundColor: 'transparent'
  };

  const handleRegister = () => {
    navigate('/signup/hospital');
  };

  return (
      <div className="login-container">
        <div className="tab-menu">
          <button className="tab active">병원 로그인</button>
          <button
              className="tab"
              onClick={() => navigate('/login/admin')}
          >관리자 로그인</button>
        </div>
        <div className="login-content">
          <div style={logoStyle}>
            <img src={SOSLogo} alt="SOS Logo" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="아이디"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">병원 로그인</button>
            <div className="register">
              <p>ID가 없다면, 회원 가입하세요.</p>
              <button type="button" className="register-button" onClick={handleRegister}>
                회원가입하기
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick/>
      </div>
  );
};

export default LoginHospital;
