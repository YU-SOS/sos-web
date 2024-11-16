import React from 'react'
import styled from 'styled-components'
import LeftPanel from './left/LeftPanel'
import RightPanel from './right/RightPanel'

const MainPanel = () => {
  return (
    <Wrapper>
        <LeftPanel/>
        <RightPanel/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display : flex;
    height : 100%;
    justify-content : space-between;

`

export default MainPanel