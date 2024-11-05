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

// Fetch the list of emergency receptions
export const getEmergencyList = async (categories, page) => {
    const token = getAuthToken();  // Get the token from local storage
    if (!token) {
        console.error("Token not found. Please log in.");
        return;
    }

    // Prepare query parameters
    const query = {
        categories: categories.join('&categories='),  // Join categories for the query string
        page: page
    };

    try {
        const response = await apiClient.get(`/hospital/receptions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: query
        });
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error fetching emergency list:", error);
        throw error;  // Rethrow error for further handling
    }
};

// Fetch details of a specific hospital
export const getHospitalDetails = async (hospitalId) => {
    const token = getAuthToken();  // Get the token from local storage
    if (!token) {
        console.error("Token not found. Please log in.");
        return;
    }

    try {
        const response = await apiClient.get(`/hospital/${hospitalId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error fetching hospital details:", error);
        throw error;  // Rethrow error for further handling
    }
};

// Accept or reject a visit request
export const respondToReceptionRequest = async (receptionId, isApproved) => {
    const token = getAuthToken();  // Get the token from local storage
    if (!token) {
        console.error("Token not found. Please log in.");
        return;
    }

    try {
        const response = await apiClient.put(`/hospital/receptions/${receptionId}`, {
            isApproved: isApproved
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error responding to reception request:", error);
        throw error;  // Rethrow the error for further handling
    }
};

/* // Fetch guest reception details by reception ID
export const getGuestReceptionDetails = async (receptionId) => {
    // Validate receptionId
    if (!receptionId) {
        console.error("Reception ID is required.");
        return;
    }

    try {
        const response = await apiClient.get(`/hospital/receptions/${receptionId}/guest`);
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error fetching guest reception details:", error);
        throw error;  // Rethrow the error for further handling
    }
}; */

// Add this function to your existing hospitalAPI.js file

// Submit a comment for a specific reception
export const submitCommentForReception = async (receptionId, description) => {
    const token = getAuthToken();  // Get the token from local storage
    if (!token) {
        console.error("Token not found. Please log in.");
        return;
    }

    // Validate input
    if (!receptionId || !description) {
        console.error("Both reception ID and comment description are required.");
        return;
    }

    try {
        const response = await apiClient.post(`/hospital/receptions/${receptionId}/comment`, {
            description: description
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error submitting comment for reception:", error);
        throw error;  // Rethrow the error for further handling
    }
};

// Add this function to hospitalAPI.js
export const updateReceptionStatus = async (receptionId, isApproved) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("Token not found.");

    try {
        const response = await apiClient.put(`/hospital/receptions/${receptionId}`, 
            { isApproved }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating reception status:", error);
        throw error;
    }
};

// Create a new reception
export const createReception = async (receptionData) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("Token not found.");

    try {
        const response = await apiClient.post(`/hospital/receptions`, receptionData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating reception:", error);
        throw error;
    }
};

// Re-request reception after rejection
export const reRequestReception = async (receptionId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("Token not found.");

    try {
        const response = await apiClient.put(`/hospital/receptions/${receptionId}/re`, null, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error re-requesting reception:", error);
        throw error;
    }
};

// Fetch guest emergency reception details
export const getGuestReceptionDetails = async (receptionId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error("Token not found.");

    try {
        const response = await apiClient.get(`/hospital/receptions/${receptionId}/guest`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching guest reception details:", error);
        throw error;
    }
};
