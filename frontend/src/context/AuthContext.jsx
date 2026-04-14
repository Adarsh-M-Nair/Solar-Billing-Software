import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null
    );
    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        try {
            const response = await api.post('token/', {
                username,
                password
            });
            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    const updateToken = async () => {
        console.log('Update token called');
        if (!authTokens) {
            setLoading(false);
            return;
        }
        
        try {
            const response = await api.post('token/refresh/', {
                refresh: authTokens?.refresh
            });

            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));
                localStorage.setItem('authTokens', JSON.stringify(response.data));
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Token refresh failed", error);
            logoutUser();
        }

        if(loading){
            setLoading(false);
        }
    };

    useEffect(() => {
        if(loading) {
            updateToken();
        }

        const fourMinutes = 1000 * 60 * 4;
        let interval = setInterval(() => {
            if(authTokens){
                updateToken();
            }
        }, fourMinutes);
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
