import React from 'react'
import styled from 'styled-components'

const Separator = ({ title }) => {

  return (
    <Wrapper>{title}</Wrapper>
  )
}

const Wrapper = styled.div`
    font-size : 32px;
    padding : 10px 0;
    
`

export default Separator