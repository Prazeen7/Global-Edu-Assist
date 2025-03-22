import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/context';

const ProtectedRoute = ({ children, isAdminRoute = false }) => {
    const { LoggedIn, UserType } = useContext(AuthContext);
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false); // State to control redirection

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        // If no token or userType, the user is not logged in
        if (!token || !userType) {
            setShouldRedirect(true); // Trigger redirection
        }
    }, [LoggedIn, UserType, isAdminRoute, location]);

    // If not logged in, redirect to login but preserve intended location
    if (!LoggedIn || shouldRedirect) {
        return <Navigate to={isAdminRoute ? "/admin" : "/login"} state={{ from: location }} replace />;
    }

    // If it's an admin route and the user is not an admin, redirect to home
    if (isAdminRoute && UserType !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // If it's an admin route and the user is an admin, allow access
    return children;
};

export default ProtectedRoute;