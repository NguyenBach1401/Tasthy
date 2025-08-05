
import axios from 'axios';
import { USER_ENDPOINTS } from '../../Constants/endpoints';


export const register = async (payload) => {
    try {
        const response = await axios.post(USER_ENDPOINTS.REGISTER, payload);
        return response.data;
    }
    catch (error) {
        throw error;
    }

};

export const login = async (payload) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN, payload);
    return response.data;
};
export const getProfile = async (token) => {
    try {
        const response = await axios.get(USER_ENDPOINTS.PROFILE, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lấy thông tin cá nhân thất bại:', error);
        throw error;
    }
};
export const updateProfile = async (token, formData) => {
    try {
        const response = await axios.put(USER_ENDPOINTS.UPDATE_PROFILE, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Sửa thông tin cá nhân thất bại:', error);
        throw error;
    }
};

export const getUserHealthSummary = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(USER_ENDPOINTS.GET_HEALTH, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sức khỏe người dùng:', error.response?.data || error);
        throw error;
    }
};