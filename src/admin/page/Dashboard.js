import React from 'react'
import styled from 'styled-components';
import MainHeader from '../component/dashboard/MainHeader';
import Title from '../component/dashboard/Title';
import MainPanel from '../component/dashboard/MainPanel';

const Dashboard = () => {
  return (
    <Wrapper>
      <MainHeader/>
      <Content>
        <Title/>
         <Container>
            <MainPanel/>
         </Container>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width : 100%;
  height : 100%;
  display : flex;
  flex-direction : column;
`

const Content = styled.div`
  /* width : 100%; */
  /* height : calc(100% - 50px); */
  /* flex-grow : 1; */
  display : flex;
  flex-direction : column;
  padding : 10px 20px;
  box-sizing : border-box;
`

const Container = styled.div`
  height : 100%;
  /* flex-direction : column; */

`

export default Dashboard;