import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { apiServer } from "../config/api";

const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error('Access token not found.');
        return null;
    }
    return { Authorization: `Bearer ${token}` };
};

const getHospitalIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
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
    const headers = getAuthHeaders();
    return apiClient.get(`/hospital/${hospitalId}`, { headers });
};

export const updateHospitalStatus = async (hospitalData) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }
    const headers = getAuthHeaders();
    return apiClient.put(`/hospital/${hospitalId}/emergencyStatus`, hospitalData, {
        headers,
        params: { emergencyStatus: Boolean(hospitalData.emergencyStatus) }
    });
};

export const updateHospitalInfo = async (hospitalData) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }
    const headers = getAuthHeaders();
    return apiClient.put(`/hospital/${hospitalId}`, hospitalData, { headers });
};

export const getEmergencyReceptionList = async () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('병원 ID를 가져오지 못했습니다.'));
    }
    const headers = getAuthHeaders();
    return apiClient.get(`/hospital/${hospitalId}/reception`, { headers });
};

export const getReceptionDetails = async (receptionId) => {
    const headers = getAuthHeaders();
    return apiClient.get(`/reception/${receptionId}`, { headers });
};

export const updateReceptionStatus = async (receptionId, isApproved) => {
    const headers = getAuthHeaders();
    try {
        const response = await apiClient.put(
            `/reception/${receptionId}`,
            { isApproved },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateReceptionStatueArrival = async (receptionId) => {
    const headers = getAuthHeaders();
    return apiClient.put(`/reception/${receptionId}/arrival`, {}, { headers });
};

export const sendComments = async (receptionId, message) => {
    const headers = getAuthHeaders();
    return apiClient.post(
        `/reception/${receptionId}/comment`,
        { description: message },
        { headers }
    );
};
