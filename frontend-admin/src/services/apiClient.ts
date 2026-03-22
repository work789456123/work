import axios from 'axios';
import config from '../config';

const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getDeviceId = () => {
    let deviceId = localStorage.getItem('pv_device_id');
    if (!deviceId) {
        deviceId = 'dv_adm_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('pv_device_id', deviceId);
    }
    return deviceId;
};

apiClient.interceptors.request.use(
    (axiosConfig) => {
        // Attach Device ID
        axiosConfig.headers['X-Device-ID'] = getDeviceId();

        // Automatically attach the auth token if it exists
        const token = localStorage.getItem('token');
        if (token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`;
        }
        return axiosConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors, like redirecting to login on 401
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access. Token might be invalid or expired.');
            // We could clear token and redirect here if we had access to the router
            // localStorage.removeItem('token');
            // window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
