import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <Wrapper>
      <Header/>
      <Outlet/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width : 100vw;
    height : 100vh;
    display : flex;
`

export default Layout