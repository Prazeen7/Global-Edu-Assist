import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/context';

const ProtectedRoute = ({ children }) => {
    const { LoggedIn } = useContext(AuthContext);
    const location = useLocation();

    // If not logged in, redirect to login but preserve intended location
    return LoggedIn ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;