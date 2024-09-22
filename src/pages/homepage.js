import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonContainer, Button } from '../components/StyledComponents';

const Homepage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    if (role === 'general') {
      navigate('/login/general'); // General User - Kakao login
    } else {
      localStorage.setItem('userRole', role); // Store the role in local storage
      navigate('/login'); // Navigate to the login component for Ambulance Personnel and Hospital Doctor
    }
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
