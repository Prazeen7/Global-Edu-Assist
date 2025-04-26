import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/context';
import { validateToken, isTokenExpired } from '../../utils/utils';

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
    const { LoggedIn, UserType, setLoggedIn } = useContext(AuthContext);
    const location = useLocation();
    const [isTokenValid, setIsTokenValid] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        // If no token or userType, the user is not logged in
        if (!token || !userType) {
            setIsTokenValid(false);
            return;
        }

        // Validate the token
        const { isValid } = validateToken(token);
        const expired = isTokenExpired(token);

        if (!isValid || expired) {
            // Clear invalid/expired token and log out
            localStorage.removeItem('token');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userType');
            setLoggedIn(false);
            setIsTokenValid(false);
        } else {
            setIsTokenValid(true);
        }
    }, [LoggedIn, UserType, isAdminRoute, location, setLoggedIn]);

    // Show loading state while validating token
    if (isTokenValid === null) {
        return <div>Loading...</div>;
    }

    // If not logged in or token is invalid, redirect to login
    if (!LoggedIn || !isTokenValid) {
        // Changed from: state={{ from: location }}
        // To: state={{ redirectTo: location.pathname }}
        return <Navigate to={isAdminRoute ? "/admin" : "/login"} state={{ redirectTo: location.pathname }} replace />;
    }

    // If it's an admin route and the user is not an admin, redirect to home
    if (isAdminRoute && UserType !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // If token is valid and user has access, render the children
    return children;
};

export default ProtectedRoute;
