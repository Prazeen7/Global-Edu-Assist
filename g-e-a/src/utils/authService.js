import axios from './axiosConfig';

/**
 * Verifies a token with the backend server and determines user type
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} The verification result with user data and type
 */
export const verifyTokenWithServer = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token provided');
        }

        // Call the backend API to verify the token
        // The token is automatically added to headers by the axios interceptor
        const response = await axios.get('/auth/verify-token');

        if (!response.data.success) {
            throw new Error(response.data.message || 'Token verification failed');
        }

        // Extract user data and type from the response
        const userData = response.data.user;
        const userType = userData.user || 'user'; 

        console.log('Token verified successfully:', { userType, userData });

        return {
            isValid: true,
            userType,
            userData
        };
    } catch (error) {
        console.error('Token verification failed:', error);

        // Clear invalid token from storage
        localStorage.removeItem('token');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userType');

        return {
            isValid: false,
            error: error.response?.data?.message || error.message || 'Token verification failed'
        };
    }
};