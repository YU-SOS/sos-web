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

// 응급실 목록 조회 (categories 필수)
// 응급실 목록 조회 API (카테고리와 페이지 포함)
export const getEmergencyList = (categories, page) => {
    const token = getAuthToken();  // 토큰을 가져옴
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }

    // categories와 page를 쿼리 스트링에 포함하여 요청
    const query = {
        categories: categories.join('&categories='),  // 여러 카테고리를 쿼리 스트링에 맞게 변환
        page: page
    };

    return apiClient.get(`/hospital`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: query
    });
};


export const getHospitalDetails = (hospitalId) => {
    const token = getAuthToken();  // 토큰을 가져옴
    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요.");
        return;
    }

    return apiClient.get(`hospital/${hospitalId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
