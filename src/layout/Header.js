import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Quit } from '../assets/svg/quit.svg';
import { ReactComponent as Request } from '../assets/svg/request.svg';
import { ReactComponent as Reception } from '../assets/svg/reception.svg';

const Header = () => {
  return (
    <Wrapper>
        <Logo>SOS</Logo>
        <Content>
            <ImageContainer>
                <Image/>
            </ImageContainer>
            <Name>
                영남대병원
            </Name>
            <Address>
                대구광역시 남구 현충로 170
                테스트 주소
            </Address>

            <ContentName>
                관리
            </ContentName>

            <Category>
                <Request />
                응급실 방문 요청
            </Category>

            <Category>
                <Reception />
                응급실 접수 목록
            </Category>
        </Content>
        <Footer>
            <QuitIcon />
            로그아웃
        </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width : 300px;
    height : 100%;
    background-color : #353535;
    position : relative;
    color : #fff;
    
`

const Logo = styled.div`
    height : 50px;
    color : #fff;
    box-sizing : border-box;
    padding : 10px;
    font-family : "Pretendard Variable";
    font-size : 30px;
    font-weight : 600;
    border-bottom : 0.5px solid #404040;
`

const Content = styled.div`
`

const ImageContainer = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    box-sizing : border-box;
    padding : 30px 0;
`

const Image = styled.div`
    width : 150px;
    height : 150px;
    border-radius : 50%;
    background-color : #f1f1f1;
`

const Name = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    box-sizing : border-box;
    padding : 20px;

    font-family : "Pretendard Variable";
    font-size : 25px; 
    font-weight : 600;
`

const Address = styled.div`
    /* height 설정 필요 */
    padding : 20px;

    font-family : "Pretendard Variable";
    font-size : 18px; 
    text-align : center;
`
const ContentName = styled.div`
    font-family : "Pretendard Variable";
    font-size : 20px; 
    color : #aaa;
    
    box-sizing : border-box;
    padding : 20px;
`

const Category = styled.div`
    box-sizing : border-box;
    padding : 15px 20px;
    display : flex;
    gap : 10px;
    align-items : center;
    transition : 0.3s;

    &:hover {
        background-color : #FF2121;
    }
`




const Footer = styled.div`
    width : 100%;
    height  : 50px;

    display : flex;
    align-items : center;
    gap : 10px;

    background-color  : #222;
    position : absolute;
    bottom : 0;
    color : #fff;
    box-sizing : border-box;
    padding : 10px 20px;
    font-family : "Pretendard Variable";
    font-size : 20px;    
    cursor : pointer;

    transition : 0.3s;

    &:hover {
        background-color : #111;
    }

`

const QuitIcon = styled(Quit)`
    width : 20px;
    height : 20px;
`


export default Header