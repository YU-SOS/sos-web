import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {apiServer} from "../config/api";  // API 서버 주소

// Axios 클라이언트 설정
const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 로컬 스토리지에서 토큰 가져오기
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// 병원 ID를 JWT 토큰에서 추출
const getHospitalIdFromToken = () => {
    const token = getAuthToken();
    if (!token) {
        console.error('토큰이 없습니다.');
        return null;
    }

    try {
        const decodedToken = jwtDecode(token);  // JWT 토큰을 디코딩
        return decodedToken.sub;
    } catch (error) {
        console.error('토큰 디코딩 중 오류 발생:', error);
        return null;
    }
};

// 병원 정보 조회 API
export const getHospitalDetails = async () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }

    const token = getAuthToken();
    return apiClient.get(`/hospital/${hospitalId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// 병원 정보 수정 API
export const updateHospitalInfo = async (hospitalData) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }

    const token = getAuthToken();
    return apiClient.put(`/hospital/${hospitalId}`, hospitalData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
};

// 응급실 방문 신청 목록 조회 API
export const getEmergencyReceptionList = async () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }

    const token = getAuthToken();
    return apiClient.get(`/hospital/${hospitalId}/reception`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateEmergencyStatus = async (emergencyStatus) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }

    const token = getAuthToken();  // 로컬 스토리지에서 엑세스 토큰 가져오기

    try {
        const response = await apiClient.put(
            `/hospital/${hospitalId}/emergencyStatus`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    emergencyStatus: emergencyStatus
                },
            });
        return response;
    } catch (error) {
        // 서버 오류 메시지 출력
        console.error('응급실 상태 변경 중 오류 발생:', error.response ? error.response.data : error.message);
        throw error;
    }
};
