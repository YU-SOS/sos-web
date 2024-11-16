import React from 'react'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import Header from './AdminHeader'


const AdminLayout = () => {
  return (
    <Wrapper>
      <Header/>
      <ContentContainer>
        <Outlet/>
      </ContentContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
    display : flex;
`

const ContentContainer = styled.div`
  width : 100%;
  height : 100%;  
`

export default AdminLayout