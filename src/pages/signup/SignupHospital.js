import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Input, Button } from '../../components/StyledComponents';
import axios from 'axios';
import signupHospitalAPI from "../../api/signup/signupHospitalAPI";
import {loginHospitalHandler} from "../../api/login/loginHandler";

const SignupHospital = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        /*const result = await signupHospitalAPI({
            id : "test2",
            password : "test",
            name : "test2",
            address : "test",
            telephoneNumber : "053-111-1111",
            imageUrl: "test.com/test",
            location : {
                latitude : "31.123",
                longitude : "18.123"
            },
            categories : ["내과"]

        })*/

        const result = await loginHospitalHandler();

        console.log(result);

        if(result.status === 409){ // 이미 존재하는 사용자
            navigate('/');
        }

    } catch (e){
        console.log(e);
    }

  };

  return (
      <FormContainer>
        <h1>병원 회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/*<Input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
          />
          <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />*/}
          <Button type="submit" primary>회원가입</Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </FormContainer>
  );
};

export default SignupHospital;
