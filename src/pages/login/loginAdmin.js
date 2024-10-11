import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginAdminAPI from '../../api/login/loginAdminAPI';
import './LoginPage.css';
import SOSLogo from '../../pages/SOS_Logo.png';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const result = await loginAdminAPI({
        adminId,
        password,
      });
  
      // Ensure that you're checking for the correct status
      if (result.status === 200) {
        alert('로그인 성공! 환영합니다.'); // Successful login alert
        navigate('/admin/dashboard'); // Navigate to the dashboard
      } else {
        toast.error('로그인에 실패했습니다. ID 또는 비밀번호를 확인하세요.'); // Login failure message
      }
    } catch (e) {
      console.error(e);
      toast.error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.'); // General error message
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

  return (
    <div className="login-container">
      <div className="tab-menu">
        <button
          className="tab"
          onClick={() => (window.location.href = '/login')}
        >병원 로그인</button>
        <button className="tab active">관리자 로그인</button>
      </div>
      <div className="login-content">
        <div style={logoStyle}>
          <img src={SOSLogo} alt="SOS Logo" style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="관리자 아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">관리자 로그인</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick/>
    </div>
  );
};

export default LoginAdmin;
