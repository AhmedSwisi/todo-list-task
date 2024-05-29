import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const auth_token = cookies.get('access_token')
console.log(auth_token, "here is the token")

export const axiosRouter = axios.create({
    baseURL:import.meta.env.VITE_PUBLIC_URL,
    timeout:1000,
    headers:{
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
    }
})

axiosRouter.interceptors.request.use(
    (config) => {
        const token = cookies.get('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors and refresh the token
axiosRouter.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = cookies.get('refresh_token');
            try {
                const response = await axios.post(`${import.meta.env.VITE_PUBLIC_URL}/auth/refresh`, {
                    refresh: refreshToken
                });
                const newAccessToken = response.data.access;
                cookies.set('access_token', newAccessToken, { path: '/' });
                axiosRouter.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosRouter(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed', refreshError);
                // Optionally, you might want to log out the user or handle the refresh failure
            }
        }
        return Promise.reject(error);
    }
);

