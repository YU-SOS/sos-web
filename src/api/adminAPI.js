import axios from 'axios';
import { apiServer } from '../config/api';
import {message} from "antd";

const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json'
    }
});

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

export const getRegistrationList = (type) => {
    const token = getAuthToken();
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }
    return apiClient.get(`/admin/registration`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: { type }
    });
};

export const getRegistrationDetails = (id, role) => {
    const token = getAuthToken();
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }
    return apiClient.get(`/admin/registration`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: { id, role }
    });
};

export const getFetchStatus = () => {
    const token = getAuthToken();
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }
    return apiClient.get(`/admin/status`, {
            headers: {'Authorization': `Bearer ${token}`}
        }
    )
};

export const approveRegistration = (id, role, isApproved) => {
    const token = getAuthToken();
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }
    return apiClient.put(`/admin/registration`,
        { isApproved },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { id, role }
        }
    );
};
