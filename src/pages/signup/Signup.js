import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from '../../assets/svg/sos-logo-white.svg'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Category from '../../components/signup/Category'

const Signup = () => {

    const handleWheel = (event) => {
        event.preventDefault(); // 기본 스크롤 방지
        event.currentTarget.scrollLeft += event.deltaY; // 수직 스크롤을 수평으로 변환
    };

  return (
    <Wrapper>
        <Header>
            <Logo/>
        </Header>

        <Content>
            <Container>
                <Title>병원 회원가입</Title>

                {/* <InputContainer>
                    <Label>아이디</Label>
                    <CustomInput />
                    <DupCheckButton>중복확인</DupCheckButton>
                </InputContainer>

                <InputContainer>
                    <Label>비밀번호</Label>
                    <CustomInput />
                </InputContainer>

                <InputContainer>
                    <Label>병원이름</Label>
                    <CustomInput />
                </InputContainer>

                <InputContainer>
                    <Label>주소</Label>
                    <CustomInput />
                    <DupCheckButton>검색</DupCheckButton>
                </InputContainer>

                <MapContainer>
                <Temp/>
                </MapContainer>

                <InputContainer>
                    <Label>위도</Label>
                    <CustomInput />
                </InputContainer>

                <InputContainer>
                    <Label>경도</Label>
                    <CustomInput />
                </InputContainer>

                <InputContainer>
                    <Label>전화번호</Label>
                    <CustomInput />
                </InputContainer> */}

                <CategoryList onWheel={handleWheel}>
                    <Category category={'산부인과'}/>
                    <Category category={'정형외과'}/>
                    <Category category={'흉부외과'}/>
                    <Category category={'화상외과'}/>
                    <Category category={'내과'}/>


                </CategoryList>

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
    /* height : 450px; */
    box-sizing : border-box;
    padding : 60px 40px;
    display : flex;
    flex-direction : column;
    justify-content : space-between;
`

const Title = styled.div`
    text-align : center;
    font-size : 32px;
    font-weight : 700;
`

const InputContainer = styled.div`
    display : flex;
    margin : 10px 0;
    gap : 20px;
`

const Label = styled.label`
    font-size : 25px;
    font-weight : 600;
    width : 15%;
    display : flex;
    justify-content : end;
    align-items : center;
`

const CustomInput = styled(Input)`
    width : 55%;
    max-width : 400px;
`

const DupCheckButton = styled(Button)`
    width : 20%;
    display : flex;
    justify-content : center;
    align-items : center;
`

const MapContainer = styled.div`
    display : flex;
    justify-content : center;
`

const Temp = styled.div`
    width : 600px;
    height : 400px;
    background-color : #aaa;
`

const CategoryList = styled.div`
    display : flex;
    justify-content : center;
    gap : 10px;
    overflow-x: auto; /* auto로 변경 */
    -ms-overflow-style: none; /* IE 및 Edge에서 스크롤바 숨기기 */
    scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
    }
`

export default Signup