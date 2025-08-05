import axios from 'axios';
import { FAVORITE_ENDPOINTS } from '../../Constants/endpoints';

export const addFavor = async (userId, recipeId) => {
    try {
        const response = await axios.post(FAVORITE_ENDPOINTS.ADD_FAVOR, null, {
            params: {
                userId,
                recipeId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};
export const removeFavor = async (userId, recipeId) => {
    try {
        const response = await axios.delete(FAVORITE_ENDPOINTS.REMOVE_FAVOR, {
            params: {
                userId,
                recipeId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};
export const getUserFavorites = async (token, pageNumber = 1, pageSize = 12) => {
    try {
        const response = await axios.get(FAVORITE_ENDPOINTS.GET_FAVOR, {
            params: { pageNumber, pageSize },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lấy danh sách yêu thích thất bại:', error);
        throw error;
    }
};

export const getTopFavorite = async () => {
    try {
        const response = await axios.get(FAVORITE_ENDPOINTS.GET_TOP);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy top favorites:', error);
        throw error;
    }
};