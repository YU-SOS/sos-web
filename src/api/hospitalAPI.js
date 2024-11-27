import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {apiServer} from "../config/api";

const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

export const getHospitalIdFromToken = () => {
    const token = getAuthToken();
    if (!token) {
        console.error('Access token not found.');
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub;
    } catch (error) {
        console.error('Error decoding the token:', error);
        return null;
    }
};

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

export const updateHospitalStatus = async (hospitalData) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }

    const token = getAuthToken();
    return apiClient.put(`/hospital/${hospitalId}/emergencyStatus`, hospitalData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        params: {
            emergencyStatus : Boolean(hospitalData.emergencyStatus)
        }
    });
};

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

export const getReceptionDetails = async (receptionId) => {
    const token = getAuthToken();
    return apiClient.get(`/reception/${receptionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateReceptionStatus = async (receptionId, isApproved) => {
    const token = getAuthToken();
    try {
        const response = await apiClient.put(
            `/reception/${receptionId}`, { isApproved }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateReceptionStatueArrival = async (receptionId) => {
    const token = getAuthToken();
    return apiClient.put(
        `/reception/${receptionId}/arrival`,
        {}, // Empty request body
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
};


export const sendComments = async (receptionId, message) => {
    const token = getAuthToken();
    return apiClient.post(
        `/reception/${receptionId}/comment`,
        { description: message },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
};
