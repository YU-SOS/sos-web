import axios from 'axios';
import { apiServer } from '../config/api'; // Adjust this path if necessary

// Create an axios instance with base configuration
const apiClient = axios.create({
    baseURL: apiServer,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper function to get the access token from local storage
const getAuthToken = () => localStorage.getItem('accessToken');

// API call to get reception details by receptionId
const getReceptionDetails = async (receptionId) => {
    const token = getAuthToken();  // Retrieve the token

    if (!token) {
        console.error("토큰이 없습니다. 로그인 후 시도하세요."); // Log an error if token is missing
        throw new Error("Authorization token is missing.");
    }

    try {
        // Make a GET request with the authorization token in the header
        const response = await apiClient.get(`/reception/${receptionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error('Failed to fetch reception details:', error); // Log the error
        throw error; // Re-throw the error to handle it in the component
    }
};

export default getReceptionDetails;