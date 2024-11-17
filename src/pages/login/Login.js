import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from '../../assets/svg/sos-logo-white.svg'
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import adminLoginHandler from '../../api/login/adminLoginHandler';
import { useNavigate } from 'react-router-dom';
import hospitalLoginHandler from '../../api/login/hospitalLoginHandler';


const Login = () => {

    const [choice, setChoice] = useState(0);
    const categories = ['병원 로그인', '어드민 로그인'];
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginHandler = async () => {
        if(choice === 0){ // 병원 로그인
            const result = await hospitalLoginHandler({id, password})
            console.log(result)
            if(result.status === 200){
                alert('로그인 성공')
                navigate('/hospital')
            } else {
                alert('로그인 실패')
            }

        } else if(choice === 1) { // 어드민 로그인
            const result = await adminLoginHandler({adminId : id, password})

            if(result.status === 200){
                alert('로그인 성공')
                navigate('/admin')
            } else {
                alert('로그인 실패')
            }
        }
    }

  return (
    <Wrapper>
        <Header>
            <Logo/>
        </Header>
        
        <Content>
            <Container>
                <CategoryList>
                    { categories.map((el, idx) => {
                        return <Category 
                        key={idx} 
                        onClick={() => setChoice(idx)}
                        isSelected={choice === idx}
                         >{el}</Category>
                    }) }
                </CategoryList>

                <InputContainer>
                    <Left>
                        로고 영역
                    </Left>
                    <Right>
                        <Input placeholder='아이디' style={{'margin-bottom' : '10px', 'margin-top' : '40px'}} value={id} onChange={(e) => setId(e.target.value)}/>
                        <Input placeholder='비밀번호' style={{'margin-bottom' : '10px'}} value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <Button style={{'width' : '100%', 'margin-bottom' : '10px'}} onClick={loginHandler} >로그인</Button>
                        <GoToSignup href='/signup/hospital' isHospital={choice===0}>아직 계정이 없다면? 회원가입</GoToSignup>
                    </Right>
                </InputContainer>
            </Container>
        </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    height : 100vh;
`

const Header = styled.div`
    height : 70px;
    background-color : #353535;
    display : flex;
    align-items : center;
    box-sizing : border-box;
    padding : 0 15px;
`

const Content = styled.div`
    height : calc(100% - 70px);
    display : flex;
    justify-content : center;
    align-items : center;
`

const Container = styled.div`
    border : 1px solid #d1d1d1;
    border-radius : 12px;
    width : 700px;
    height : 450px;
    box-sizing : border-box;
    padding : 60px 40px;
    display : flex;
    flex-direction : column;
    justify-content : space-between;
`

const CategoryList = styled.div`
    display : flex;
    height : 50px;
    border-bottom : 2px solid var(--main-color);

`

const InputContainer = styled.div`
    display : flex;
    justify-content : space-between;
    width : 100%;
    height : 260px;
`

const Left = styled.div`
    width : 35%;
    background-color : #aaa;
`

const Right = styled.div`
    width : 60%;
    display : flex;
    
    flex-direction : column;
    /* 
    justify-content : center; */
    
`

const Category = styled.div`
    width : 50%;
    height : 100%;
    display : flex;
    justify-content : center;
    align-items : center;
    cursor : pointer;

    background-color: ${({ isSelected }) => (isSelected ? 'var(--main-color)' : 'transparent')};
    color: ${({ isSelected }) => (isSelected ? '#fff' : '#000')};
`

const GoToSignup = styled.a`
    text-decoration : underline;
    color : #aaa;
    font-size : 18px;
    text-align : right;
    display: ${({ isHospital }) => (!isHospital && 'none' )};
`


export default Login