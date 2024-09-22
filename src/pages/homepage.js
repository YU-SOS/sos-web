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
      <Button onClick={() => handleRoleClick('admin')}>Admin</Button>
      <Button onClick={() => handleRoleClick('ambulance')}>Ambulance Personnel</Button>
      <Button onClick={() => handleRoleClick('hospital')}>Hospital Doctor</Button>
    </ButtonContainer>
  );
};

export default Homepage;
