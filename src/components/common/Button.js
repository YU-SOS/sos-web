import styled from "styled-components";

const Button = styled.div`

    border-radius : 6px;
    text-align : center;
    padding : 10px 0;
    width : 200px;
    transition : 0.3s;
    background-color : var(--main-color);
    color : #fff;
    cursor: pointer;

    &:hover{
        
        font-size : 600;
    }
`

export default Button;