import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const [userType, setUserType] = useState('');

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userAvatar, setUserAvatar, userType, setUserType }}>
            {children}
        </AuthContext.Provider>
    );
};