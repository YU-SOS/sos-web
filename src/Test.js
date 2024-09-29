import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { apiServer } from './config/api';
import { loginHandler } from './api/loginHandler';

const Test = () => {

    const [val, setVal] = useState("");

    const get = async () => {
        try {
            const result = await axios.get(apiServer + '/test/amb');    

            console.log(result);

            setVal(result.data);
            
        } catch (error) {
            console.error(error)
        }
        
    }



    const onClickHandler = async () => {
        const response = await loginHandler();
        console.log(response);
    }


    useEffect(()=>{
        get();
    },[])

  return (
    <>
    <div>Test
    </div>
    <div>
        {val}
    </div>

    <button onClick={onClickHandler}>submit</button>
    </>
    
  )
}

export default Test