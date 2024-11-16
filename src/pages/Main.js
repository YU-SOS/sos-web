import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from "../assets/svg/sos-logo.svg"
import { useNavigate } from 'react-router-dom'

const Main = () => {

    const navigate = useNavigate();

    const clickHandler = () => {
        navigate('/login')
    }

  return (
    <Wrapper>
        <Container> 
            <Title> <Logo/> </Title>
            <Description>
                SOS는 구급대 - 병원 간 환자 이송 커뮤니케이션 서비스입니다.
                <br/>
                의료진 파업, 응급실 병상 부족과 같은
                <br/>
                사회 문제를 IT 플랫폼을 통하여 해결하도록 노력하겠습니다.
            </Description>
            <LogoContainer>
                <L></L>
            </LogoContainer>

            <Button onClick={clickHandler}>로그인하러 가기</Button>
        </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    height : 100vh;
    display : flex;
    justify-content : center;
    align-items : center;
`

const Container = styled.div`
    border : 1px solid #d1d1d1;
    border-radius : 12px;
    width : 600px;
    height : 700px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    box-sizing : border-box;
    padding : 75px 35px;
    display : flex;
    justify-content : space-between;
    flex-direction : column;
    align-items : center;
`

const Title = styled.div`
    font-size : 32px;
    font-weight : 600;
    text-align : center;
`

const Description = styled.div`
    box-sizing : border-box;
    padding : 30px 0;
    text-align : center;
    font-size : 18px;
    line-height : 40px;
`

const LogoContainer = styled.div`
    display : flex;
    justify-content : center;
`

const L = styled.div`
    width : 150px;
    height : 150px;
    background-color : #aaa;
`

const Button = styled.div`
    border : 1px solid #000;
    border-radius : 12px;
    text-align : center;
    padding : 10px 0;
    width : 200px;
    transition : 0.3s;
    cursor: pointer;

    &:hover{
        background-color : #353535;
        color : #fff;
    }
`



export default Main