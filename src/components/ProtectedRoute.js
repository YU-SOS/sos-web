import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  // 인증된 사용자인지 확인 (localStorage에서 토큰을 확인)
  const accessToken = localStorage.getItem('accessToken');

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login/admin" replace />;
  }

  // 토큰이 있으면 자식 컴포넌트를 렌더링
  return children;
};

export default ProtectedRoute;
