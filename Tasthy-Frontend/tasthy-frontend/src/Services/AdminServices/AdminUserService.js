import axios from 'axios';
import { USER_ENDPOINTS } from '../../Constants/endpoints';

export const getAllUsers = async (token, pageNumber = 1, pageSize = 10, keyword = '', gender = '', activityLevel = '') => {
    try {
        const response = await axios.get(USER_ENDPOINTS.GET_ALL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                pageNumber,
                pageSize,
                keyword,
                gender,
                activityLevel,
            },
        });
        if (response.data && Array.isArray(response.data.users)) {
            return {
                users: response.data.users,
                totalRecords: response.data.totalRecords,
            };
        } else {
            console.error('Dữ liệu không hợp lệ:', response.data);
            return { users: [], totalRecords: 0 };
        }
    } catch (error) {
        console.error('Lấy danh sách người dùng thất bại:', error);
        throw error;
    }
};