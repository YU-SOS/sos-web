import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiServer } from '../config/api';

// Axios client configuration
const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Retrieve the token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Extract the hospital ID from the JWT token
const getHospitalIdFromToken = () => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found.');
        return null;
    }

    try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        return decodedToken.sub; // Assuming 'sub' contains the hospital ID
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Fetch the list of emergency receptions
export const getEmergencyList = async (categories, page) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    const query = {
        categories: categories.join('&categories='),
        page: page,
    };

    try {
        const response = await apiClient.get('/hospital/receptions', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: query,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching emergency list:', error.response || error);
        throw error;
    }
};

// Fetch the emergency reception list
export const getEmergencyReceptionList = async () => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('Hospital ID not found.'));
    }

    const token = getAuthToken();
    try {
        const response = await apiClient.get(`/hospital/${hospitalId}/reception`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching emergency reception list:', error.response || error);
        throw error;
    }
};

// Fetch hospital details
export const getHospitalDetails = async (hospitalId = null) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    const id = hospitalId || getHospitalIdFromToken();
    if (!id) {
        console.error('Hospital ID not found.');
        return;
    }

    try {
        const response = await apiClient.get(`/hospital/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hospital details:', error.response || error);
        throw error;
    }
};

// Update hospital information
export const updateHospitalInfo = async (hospitalData) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('Hospital ID not found.'));
    }

    const token = getAuthToken();
    try {
        const response = await apiClient.put(`/hospital/${hospitalId}`, hospitalData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating hospital info:', error.response || error);
        throw error;
    }
};

// Fetch patient details for a hospital
export const getPatientDetails = async (hospitalId) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    if (!hospitalId) {
        console.error('Hospital ID is required.');
        return;
    }

    try {
        const response = await apiClient.get(`/hospital/${hospitalId}/patients`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching patient details:', error.response || error);
        throw error;
    }
};

// Fetch ambulance details
export const getAmbulanceDetails = async (ambulanceId) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    try {
        const response = await apiClient.get(`/ambulance/${ambulanceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching ambulance details:', error.response || error);
        throw error;
    }
};

// Respond to reception requests
export const respondToReceptionRequest = async (receptionId, isApproved) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    try {
        const response = await apiClient.put(
            `/hospital/receptions/${receptionId}`,
            { isApproved },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error responding to reception request:', error.response || error);
        throw error;
    }
};

// Submit a comment for a reception
export const submitCommentForReception = async (receptionId, description) => {
    const token = getAuthToken();
    if (!token) {
        console.error('Token not found. Please log in.');
        return;
    }

    if (!receptionId || !description) {
        console.error('Both reception ID and description are required.');
        return;
    }

    try {
        const response = await apiClient.post(
            `/hospital/receptions/${receptionId}/comment`,
            { description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting comment:', error.response || error);
        throw error;
    }
};

// Update emergency status
export const updateEmergencyStatus = async (emergencyStatus) => {
    const hospitalId = getHospitalIdFromToken();
    if (!hospitalId) {
        return Promise.reject(new Error('Hospital ID not found.'));
    }

    const token = getAuthToken();

    try {
        const response = await apiClient.put(
            `/hospital/${hospitalId}/emergencyStatus`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    emergencyStatus: emergencyStatus,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating emergency status:', error.response || error);
        throw error;
    }
};

// Fetch guest emergency reception details
export const getGuestReceptionDetails = async (receptionId) => {
    const token = getAuthToken();
    if (!token) throw new Error('Token not found.');

    try {
        const response = await apiClient.get(`/hospital/receptions/${receptionId}/guest`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching guest reception details:', error.response || error);
        throw error;
    }
};
