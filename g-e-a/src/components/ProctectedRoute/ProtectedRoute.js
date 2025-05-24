import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/context';
import axios from '../../utils/axiosConfig';

const ProtectedRoute = ({
    children,
    isAdminRoute = false,
    isAgentRoute = false,
    isUserRoute = false,
    allowUnauthenticated = false,
    allowUserOnly = false
}) => {
    const { LoggedIn, UserType, setLoggedIn, setUserType, setUserData } = useContext(AuthContext);
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyTokenWithServer = async () => {
            const token = localStorage.getItem('token');

            // If no token and we allow unauthenticated access
            if (!token && allowUnauthenticated) {
                setIsVerifying(false);
                setIsAuthorized(true);
                return;
            }

            // If no token and we don't allow unauthenticated access
            if (!token && !allowUnauthenticated) {
                setIsVerifying(false);
                setIsAuthorized(false);
                return;
            }

            try {
                // Call the backend API to verify the token
                const response = await axios.get('/auth/verify-token');

                if (response.data.success) {
                    // Token is valid according to the server
                    const userData = response.data.user;
                    const userType = userData.user || 'user';

                    // Update context with user information
                    setLoggedIn(true);
                    setUserType(userType);
                    setUserData(userData);

                    // Store user type in localStorage
                    localStorage.setItem('userType', userType);

                    // Strict role-based access control
                    if (isAdminRoute && userType === 'admin') {
                        setIsAuthorized(true);
                    } else if (isAgentRoute && userType === 'agent') {
                        setIsAuthorized(true);
                    } else if (isUserRoute && userType === 'user') {
                        setIsAuthorized(true);
                    } else if (allowUserOnly) {
                        // For routes that allow only regular users or unauthenticated visitors
                        if (userType === 'user' || !LoggedIn) {
                            setIsAuthorized(true);
                        } else {
                            console.log(`Access denied: User type '${userType}' cannot access this route`);
                            setIsAuthorized(false);
                        }
                    } else if (!isAdminRoute && !isAgentRoute && !isUserRoute && !allowUserOnly) {
                        // If no specific role is required, allow access to any authenticated user
                        setIsAuthorized(true);
                    } else {
                        // User doesn't have the required role for this route
                        console.log(`Access denied: User type '${userType}' cannot access this route`);
                        setIsAuthorized(false);
                    }
                } else {
                    // Token is invalid according to the server
                    handleInvalidToken();
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                handleInvalidToken();
            } finally {
                setIsVerifying(false);
            }
        };

        const handleInvalidToken = () => {
            // Clear invalid token and log out
            localStorage.removeItem('token');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userType');
            setLoggedIn(false);
            setUserType('u');
            setUserData(null);

            // If we allow unauthenticated access, still authorize
            if (allowUnauthenticated) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        };

        verifyTokenWithServer();
    }, [
        location.pathname,
        setLoggedIn,
        setUserType,
        setUserData,
        isAdminRoute,
        isAgentRoute,
        isUserRoute,
        allowUnauthenticated,
        allowUserOnly,
        LoggedIn
    ]);

    // Show loading state while verifying token
    if (isVerifying) {
        return <div>Verifying authentication...</div>;
    }

    // If not authorized, redirect to appropriate page based on user type
    if (!isAuthorized) {
        if (!LoggedIn) {
            // If not logged in, redirect to login
            if (isAdminRoute) {
                return <Navigate to="/admin" state={{ redirectTo: location.pathname }} replace />;
            } else if (isAgentRoute) {
                return <Navigate to="/agent-login" state={{ redirectTo: location.pathname }} replace />;
            } else {
                return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
            }
        } else {
            // If logged in but unauthorized, redirect to appropriate dashboard based on user type
            if (UserType === 'admin') {
                return <Navigate to="/admin/dashboard" replace />;
            } else if (UserType === 'agent') {
                return <Navigate to="/agent-dashboard" replace />;
            } else {
                return <Navigate to="/" replace />;
            }
        }
    }

    // If authorized, render the children
    return children;
};

export default ProtectedRoute;