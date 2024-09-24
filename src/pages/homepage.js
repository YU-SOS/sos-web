import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ButtonContainer, Button } from '../components/StyledComponents';

const Homepage = () => {
  const navigate = useNavigate(); 

  const handleRoleClick = (role) => {
    if (role === 'admin') {
      navigate('/login/admin');
    } else if (role === 'ambulance') {
      navigate('/login/ambulance');
    } else if (role === 'hospital') {
      navigate('/login/hospital');
    }
  };

  return (
    <ButtonContainer>
      <Button onClick={() => handleRoleClick('admin')}>관리자</Button>
      <Button onClick={() => handleRoleClick('ambulance')}>구급대원</Button>
      <Button onClick={() => handleRoleClick('hospital')}>병원 의사</Button>
    </ButtonContainer>
  );
};

export default Homepage;
