import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3001/api",
});

// Add a request interceptor to include the JWT token in headers
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("auth");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response error:", error.response.status, error.response.data);

            if (error.response.status === 401) {
                // Handle unauthorized errors (e.g., token expired)
                localStorage.removeItem("token");
                localStorage.removeItem("auth");
                localStorage.removeItem("userAvatar");
                localStorage.removeItem("userType");
                // You might want to redirect to login page
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Request error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;