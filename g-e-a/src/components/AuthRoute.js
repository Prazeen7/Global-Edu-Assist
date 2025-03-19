import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/context';

const AuthRoute = ({ children }) => {
    const { LoggedIn } = useContext(AuthContext);

    // If the user is logged in, redirect to the home page
    if (LoggedIn) {
        return <Navigate to="/" replace />;
    }

    // If the user is not logged in, allow access to the route
    return children;
};

export default AuthRoute;