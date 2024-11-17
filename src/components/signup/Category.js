import React, { useState } from 'react'
import styled from 'styled-components'

const Category = ({isSelected, category}) => {

    const [isSel, setIsSel] = useState(false);

  return (
    <Wrapper onClick={() => setIsSel(prev => !prev)} isSelected={isSel}>{category}</Wrapper>
  )
}

const Wrapper = styled.div`
    padding : 10px 20px;
    border-radius : 30px;
    background-color : #aaa;
    font-weight : 600;
    transition : 0.2s;
    cursor : pointer;
    min-width : 60px;
    text-align : center;

    background-color: ${({ isSelected }) => (isSelected ? 'var(--main-color)' : '#aaa')};
    color: ${({ isSelected }) => (isSelected ? '#fff' : '#333')};
`

export default Category