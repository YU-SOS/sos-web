import React from 'react'
import styled from 'styled-components'

const Category = ({ Icon, text, onClick, isActive }) => {
  return (
    <Wrapper onClick={onClick} isActive={isActive}>
        <Icon/>
        {text}
    </Wrapper>
  )
}

const Wrapper = styled.div`
    box-sizing : border-box;
    padding : 15px 20px;
    display : flex;
    gap : 10px;
    align-items : center;
    background-color: ${({ isActive }) => (isActive ? '#FF2121' : 'transparent')};
    transition : 0.3s;
    cursor: pointer;

    &:hover {
        background-color : #FF2121;
    }
`


export default Category