import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import dupCheckAPI from "@/api/dupCheckAPI"; 
import loginAdminAPI from "@/api/loginAdminAPI"; 
import loginHospitalAmbulanceAPI from "@/api/loginHospitalAmbulanceAPI"; 
import logoutAPI from "@/api/logoutAPI"; 
import reissueTokenAPI from "@/api/reissueTokenAPI"; 
import signupHospitalAPI from "@/api/signupHospitalAPI"; 
import RegistrationRequestOverview from "@/api/RegistrationRequestOverview";
import RegistrationRequestDetail from "@/api/RegistrationRequestDetail";
import RegistrationDecision from "@/api/RegistrationDecision";

const ApiComponent = () => {
  const [dupCheckResult, setDupCheckResult] = useState(null);
  const [loginAdminResult, setLoginAdminResult] = useState(null);
  const [loginHospitalResult, setLoginHospitalResult] = useState(null);
  const [logoutResult, setLogoutResult] = useState(null);
  const [reissueTokenResult, setReissueTokenResult] = useState(null);
  const [signupHospitalResult, setSignupHospitalResult] = useState(null);
  const [registrationRequestOverviewResult, setRegistrationRequestOverviewResult] = useState(null);
  const [registrationRequestDetailResult, setRegistrationRequestDetailResult] = useState(null);
  const [registrationDecisionResult, setRegistrationDecisionResult] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkDuplication = async () => {
      try {
        const result = await dupCheckAPI();
        setDupCheckResult(result);
      } catch (error) {
        console.error("Duplication Check Error:", error);
        navigate("/error");
      }
    };

    const loginAdmin = async () => {
      try {
        const result = await loginAdminAPI();
        setLoginAdminResult(result);
      } catch (error) {
        console.error("Admin Login Error:", error);
        navigate("/error");
      }
    };

    const loginHospitalAmbulance = async () => {
      try {
        const result = await loginHospitalAmbulanceAPI();
        setLoginHospitalResult(result);
      } catch (error) {
        console.error("Hospital/Ambulance Login Error:", error);
        navigate("/error");
      }
    };

    const logout = async () => {
      try {
        const result = await logoutAPI();
        setLogoutResult(result);
      } catch (error) {
        console.error("Logout Error:", error);
        navigate("/error");
      }
    };

    const reissueToken = async () => {
      try {
        const result = await reissueTokenAPI();
        setReissueTokenResult(result);
      } catch (error) {
        console.error("Reissue Token Error:", error);
        navigate("/error");
      }
    };

    const signupHospital = async () => {
      try {
        const result = await signupHospitalAPI();
        setSignupHospitalResult(result);
      } catch (error) {
        console.error("Signup Hospital Error:", error);
        navigate("/error");
      }
    };

    const fetchRegistrationRequestOverview = async () => {
      try {
        const result = await RegistrationRequestOverview();
        setRegistrationRequestOverviewResult(result);
      } catch (error) {
        console.error("Registration Request Overview Error:", error);
        navigate("/error");
      }
    };

    const fetchRegistrationRequestDetail = async (id = 'sample-id', role = 'AMB_GUEST') => {
      try {
        const result = await RegistrationRequestDetail(id, role);
        setRegistrationRequestDetailResult(result);
      } catch (error) {
        console.error("Registration Request Detail Error:", error);
        navigate("/error");
      }
    };

    const handleRegistrationDecision = async (id = 'sample-id', role = 'AMB_GUEST', decision = 'approve') => {
      try {
        const result = await RegistrationDecision(id, role, decision);
        setRegistrationDecisionResult(result);
      } catch (error) {
        console.error("Registration Decision Error:", error);
        navigate("/error");
      }
    };


    checkDuplication();
    loginAdmin();
    loginHospitalAmbulance();
    logout();
    reissueToken();
    signupHospital();
    fetchRegistrationRequestOverview();
    fetchRegistrationRequestDetail();
    handleRegistrationDecision();
  }, [navigate]);

  return (
    <Wrapper>
      <Container>
        <h1>API Results</h1>
        <div>{dupCheckResult && JSON.stringify(dupCheckResult)}</div>
        <div>{loginAdminResult && JSON.stringify(loginAdminResult)}</div>
        <div>{loginHospitalResult && JSON.stringify(loginHospitalResult)}</div>
        <div>{logoutResult && JSON.stringify(logoutResult)}</div>
        <div>{reissueTokenResult && JSON.stringify(reissueTokenResult)}</div>
        <div>{signupHospitalResult && JSON.stringify(signupHospitalResult)}</div>
        <div>{registrationRequestOverviewResult && JSON.stringify(registrationRequestOverviewResult)}</div>
        <div>{registrationRequestDetailResult && JSON.stringify(registrationRequestDetailResult)}</div>
        <div>{registrationDecisionResult && JSON.stringify(registrationDecisionResult)}</div>
      </Container>
    </Wrapper>
  );
};

export default ApiComponent;

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  padding: 20px;
  margin: 0 auto;
  max-width: 800px;
`;
