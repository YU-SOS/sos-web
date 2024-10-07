import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginHospitalAPI from '../../api/login/loginHospitalAPI';
import '../LoginPage.css';

const LoginHospital = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginHospitalAPI({
        id,
        password,
        role,
      });

      if (result.status === 200) {
        alert('로그인 성공! 환영합니다.');
        localStorage.setItem('HospitalDoctorLoggedIn', true);
        navigate('/hospital/dashboard');
      } else if (result.status === 403) {
        toast.error('블랙리스트된 사용자입니다.');
      } else if (result.status === 404) {
        toast.error('사용자 조회 불가. ID 또는 비밀번호를 확인하세요.');
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      console.error(e);
      toast.error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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
              onClick={() => (window.location.href = '/login/admin')}
          >
            관리자 로그인
          </button>
        </div>
        <div className="login-content">
          <div className="logo-space">LOGO가 들어갈 공간</div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">
              병원 로그인
            </button>
            <div className="register">
              <p>ID가 없다면, 회원 가입하세요.</p>
              <button type="button" className="register-button" onClick={handleRegister}>
                회원가입하기
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
      </div>
  );
};

export default LoginHospital;