import apiClient from './apiClient';

export const login = async (email: string, password: string) => {
    // backend-new uses JSON login for admin
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
};

export const fetchDashboardStats = async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
};

export const fetchFarmers = async () => {
    const response = await apiClient.get('/admin/farmers');
    return response.data;
};

export const fetchAnimals = async () => {
    const response = await apiClient.get('/admin/animals');
    return response.data;
};

export const fetchConsultations = async () => {
    const response = await apiClient.get('/admin/farm-consultations');
    return response.data;
};

export const fetchAlerts = async () => {
    const response = await apiClient.get('/admin/farm-alerts');
    return response.data;
};

export const fetchBlogs = async () => {
    const response = await apiClient.get('/blogs');
    return response.data;
};

export const fetchDoctors = async () => {
    const response = await apiClient.get('/doctors');
    return response.data;
};

export const register = async (userData: { full_name: string, phone_or_email: string, password: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};
