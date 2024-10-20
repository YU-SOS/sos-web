import axios from 'axios';
import { apiServer } from '../config/api';

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
    const token = getAuthToken();  // 토큰을 가져옴
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

export const approveRegistration = (id, role, isApproved) => {
    const token = getAuthToken();  // 토큰을 가져옴
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }

    // API 3번 PUT 요청
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