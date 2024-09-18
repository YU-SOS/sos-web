import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonContainer, Button } from '../components/StyledComponents';

const Homepage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(role === 'general' ? '/login/general' : '/login');
  };

  return (
    <ButtonContainer>
      <Button onClick={() => handleRoleClick('general')}>General User</Button>
      <Button onClick={() => handleRoleClick('ambulance')}>Ambulance Personnel</Button>
      <Button onClick={() => handleRoleClick('hospital')}>Hospital Doctor</Button>
    </ButtonContainer>
  );
};

export default Homepage;
