import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { loginHandler } from './api/login/loginHandler';

const Test = () => {
    const [val, setVal] = useState("");

    const get = async () => {
        try {
            const result = await axios.get(apiServer + '/test/awb');

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

    useEffect(() => {
        get();
    },[])

    return (
        <>
        <div>Test
        </div>
        <div>
            {val}
        </div>

        <button onClick={onClickHandler}>Submit</button>
        </>
    )
}

export default Test