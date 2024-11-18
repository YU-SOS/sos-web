import React from 'react';
import { Card, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import SOSLogo from '../pages/SOS_Logo.png';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5' }}>
        <Card
            style={{
              width: 500,
              textAlign: 'center',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
          <Title level={1}>SOS</Title>
          <Paragraph>
            의료진 파업, 병상 부족 등의 문제를 해결하기 위해 고안된 서비스 <br/>
            구급대 - 병원 간 커뮤니케이션 플랫폼 SOS 입니다.
          </Paragraph>
          <img
              src={SOSLogo}
              alt="SOS Logo"
              style={{margin: '16px', width: '50%', height: '50%', objectFit: 'contain'}}
          />
          <Button type="primary" style={{width: '100%'}} onClick={handleLoginClick}>
            로그인
          </Button>
        </Card>
      </div>
  );
};

export default HomePage;
