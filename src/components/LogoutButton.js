import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoutAPI from '../api/logout/logoutAPI';
import { Button } from './StyledComponents';
import { ToastContainer, toast } from 'react-toastify';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logoutAPI();

      if (result.status === 200) {
        toast.success(result.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('HospitalDoctorLoggedIn');
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <>
      <Button onClick={handleLogout} primary>
        로그아웃
      </Button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
    </>
  );
};

export default LogoutButton;
