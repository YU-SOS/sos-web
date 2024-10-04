import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiServer } from './config/api';
import { loginHandler } from './api/login/loginHandler';

const Test = () => {
    const [val, setVal] = useState("");

    const get = async () => {
        try {
            const result = await axios.get(apiServer + '/test/amb');
            console.log(result);
            setVal(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onClickHandler = async () => {
        try {
            const response = await loginHandler();
            console.log(response);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    useEffect(() => {
        get();
    }, []);

    return (
        <>
            <div>Test</div>
            <div>{val}</div>
            <button onClick={onClickHandler}>Submit</button>
        </>
    );
};

export default Test;