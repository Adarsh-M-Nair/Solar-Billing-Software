import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
        if (authTokens?.access) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
