import React from 'react'
import Separator from './Separator'
import RegisterList from './RegisterList'

const Register = ({title}) => {
  return (
    <div>
        <Separator title={title}></Separator>
        <RegisterList></RegisterList>
    </div>
  )
}  

export default Register