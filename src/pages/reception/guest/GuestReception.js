import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {styled} from 'styled-components';
import apiClient from '../../../api/apiClient';

const GuestReception = () => {

  const { receptionNumber } = useParams();
  const [ reception, setReception ] = useState();
  
  useEffect(() => {
    const fetchReception = () => {
      try {
        const response = apiClient.get(`/reception/${receptionNumber}/guest`);

        console.log(response);
        setReception(response.data);
      } catch(err) {
        console.error(err);
      }
    }

    fetchReception();

    console.log(receptionNumber);
  })

  return (
    <Wrapper>
      <Header>SOS</Header>
      <Map>Map</Map>

      <Content>

        <SubTitleContainer>
          <SubTitle>병원 정보</SubTitle>
        </SubTitleContainer>

        <Container>
          <Category>병원명</Category>
          <p>영남대학교 병원</p>
        </Container>

        <Container>
          <Category>병원 주소</Category>
          <p>대구 달서구 중동 574-2</p>
        </Container>

        <Container>
          <Category>병원 전화번호</Category>
          <p>053-123-4567</p>
        </Container>

        <StyledHr/>

        <SubTitleContainer>
          <SubTitle>환자 정보</SubTitle>
        </SubTitleContainer>

        <Container>
          <Category>이름</Category>
          <p>홍길동</p>
        </Container>

        <Container>
          <Category>나이</Category>
          <p>24</p>
        </Container>

        <Container>
          <Category>전화번호</Category>
          <p>010-1234-5678</p>
        </Container>

        <Container>
          <Category>증상</Category>
          <p>코로나 후유증</p>
        </Container>

      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width : 100vw;
  height : 100vh;
`

const Header = styled.div`
  height : 60px;
  border-bottom : 0.5px solid #dfdfdf;
  display : flex;
  align-items : center;
  box-sizing : border-box;
  padding : 0 15px;
  font-family : "Jockey One", sans-serif;
  font-size : 35px;
  font-weight : 600;
`

const Map = styled.div`
  background-color : #ddd;
  height : 200px;
`

const Content = styled.div`
  box-sizing : border-box;
  padding : 15px;
  display : flex;
  flex-direction : column;
`

const Container = styled.div`
  width : 100%;
  display : flex;
  justify-content : space-between;
  align-items : center;
  margin-bottom : 10px;
`

const SubTitleContainer = styled.div`
  display : flex;
  justify-content : end;
`

const SubTitle = styled.p`
  font-size : 25px;
  font-weight : 600;
  padding : 0 0 3px 0;
  margin-bottom : 20px;
  text-align : right;
  border-bottom : 1px solid #dfdfdf;
`

const Category = styled.div`
  font-size : 20px;
  font-weight : 600;
`

const StyledHr = styled.div`
  height : 0.2px;
  background-color : #d1d1d1;
  margin-top : 20px;
  margin-bottom : 20px;
`

const Notice = styled.div`
  height : 200px;
  color : #d1d1d1;
  display : flex;
  justify-content : center;
  align-items : end;
`

export default GuestReception