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
        return Promise.reject(new Error('Failed to retrieve hospital ID.'));
    }

    const token = getAuthToken();
    return apiClient.get(`/hospital/${hospitalId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateHospitalInfo = async (hospitalData) => {
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

    const token = getAuthToken();

    try {
        const response = await apiClient.put(
            `/hospital/${hospitalId}/emergencyStatus`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params: {
                    emergencyStatus: emergencyStatus
                },
            });
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAmbulanceDetails = async (ambulanceId) => {
    try {
        const response = await apiClient.get(`/ambulance/${ambulanceId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
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


export const getPatientDetails = async (hospitalId) => {
    const token = localStorage.getItem('accessToken'); // Retrieve the token
    if (!token) {
        console.error("Token not found. Please log in.");
        return;
    }

    // Validate the hospitalId
    if (!hospitalId) {
        console.error("Hospital ID is required.");
        return;
    }

    try {
        const response = await apiClient.get(`/hospital/${hospitalId}/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data; // Return the patient data
    } catch (error) {
        console.error("Error fetching patient details:", error.response || error);
        throw error; // Rethrow the error for further handling
    }
};
