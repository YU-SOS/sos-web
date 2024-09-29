import React from 'react'
import styled from 'styled-components'
import Category from './Category'

const CategoryList = ({title, categoryList}) => {
  return (
    <Wrapper>
        <Title>{title}</Title>
        {
            categoryList.map((el, index) => (
                <Category 
                    key={index} 
                    Icon={el.Icon} 
                    text={el.text} 
                    onClick={el.onClick}
                    isActive={el.isActive}
                />
            ))
        }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    font-family : "Pretendard Variable";
    
`

const Title = styled.div`
    padding : 15px 20px;
    font-size : 20px; 
    color : #aaa;
`

export default CategoryList