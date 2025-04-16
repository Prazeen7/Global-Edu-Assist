import { jwtDecode } from 'jwt-decode'; 

// Validate token structure and signature (basic check)
export const validateToken = (token) => {
    try {
        if (!token) {
            return { isValid: false, error: 'No token provided' };
        }

        // Decode token to verify its structure
        const decoded = jwtDecode(token);
        if (!decoded) {
            return { isValid: false, error: 'Invalid token structure' };
        }

        return { isValid: true, decoded };
    } catch (error) {
        return { isValid: false, error: 'Invalid token: ' + error.message };
    }
};

// Check if the token is expired
export const isTokenExpired = (token) => {
    try {
        const { decoded } = validateToken(token);
        if (!decoded) {
            return true; 
        }

        const currentTime = Date.now() / 1000; 
        return decoded.exp < currentTime; 
    } catch (error) {
        return true; 
    }
};