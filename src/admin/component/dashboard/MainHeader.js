import React from 'react'
import styled from 'styled-components'

const MainHeader = () => {
  return (
    <Wrapper>관리자 대시보드</Wrapper>
  )
}

const Wrapper = styled.div`
    width : 100%;
    height : 50px;
    border-bottom : 0.5px solid #d1d1d1;
    box-sizing : border-box;
    padding : 0 20px;
    display : flex;
    align-items : center;

    font-size : 30px;
    font-weight : 700;  
`


export default MainHeader