import React from 'react'
import styled from 'styled-components';
import Register from './Register';

const LeftPanel = () => {
  return (
    <Wrapper>
      <Register title={'병원'}/>
      <Register title={'구급대'}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width : 60%;
    display : flex;
    flex-direction : column;
    justify-content : space-between;
    /* background : #f00; */
`;



export default LeftPanel