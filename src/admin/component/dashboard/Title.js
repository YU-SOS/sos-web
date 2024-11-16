import React from 'react'
import styled from 'styled-components'

const Title = () => {
  return (
    <Wrapper>
        <Left>회원가입 요청</Left>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width : 100%;
    height : 50px;

    font-size : 30px;
    font-weight : 700;

    display : flex;
    box-sizing : border-box;
    padding : 0;
    justify-content : space-between;
    align-items : center;   
`

const Left = styled.div`
    border-bottom : 1px solid #aaa;
    width : 60%;
    height : 100%;
    display : flex;
    align-items : center;
`

export default Title