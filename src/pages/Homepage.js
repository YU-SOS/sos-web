import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonContainer, Button } from '../components/StyledComponents';

const Homepage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(role === 'admin' ? '/signup/admin' : (role == 'hospital' ? '/signup/hospital' : '/signup/ambulance'));
  };

  return (
    <ButtonContainer>
      <Button onClick={() => handleRoleClick('admin')}>Administrator</Button>
      <Button onClick={() => handleRoleClick('ambulance')}>Ambulance</Button>
      <Button onClick={() => handleRoleClick('hospital')}>Hospital</Button>

    </ButtonContainer>
  );
};

export default Homepage;
