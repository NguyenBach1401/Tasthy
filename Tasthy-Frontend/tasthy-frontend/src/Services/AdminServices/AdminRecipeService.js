import axios from 'axios';
import { RECIPE_ENDPOINTS } from '../../Constants/endpoints';

export const getAllRecipesForAdmin = async (pageNumber = 1, pageSize = 10, keyword = '', tagIds = []) => {

    try {
        const response = await axios.get(RECIPE_ENDPOINTS.GET_RECIPE_FOR_ADMIN, {

            params: {
                pageNumber,
                pageSize,
                keyword,
                ...(tagIds.length > 0 && { tagIds })
            },
        });
        if (response.data && Array.isArray(response.data.recipes)) {
            return {
                recipes: response.data.recipes,
                totalRecords: response.data.totalRecords,
            };
        } else {
            console.error('Dữ liệu không hợp lệ:', response.data);
            return { recipes: [], totalRecords: 0 };
        }
    } catch (error) {
        console.error('Lấy danh sách công thức thất bại:', error);
        throw error;
    }
}
export const getRecipesWithoutNutrition = async (pageNumber = 1, pageSize = 10, keyword = '') => {
    try {
        const response = await axios.get(RECIPE_ENDPOINTS.GET_RECIPE_NO_NUTRITION, {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            params: {
                pageNumber,
                pageSize,
                keyword,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công thức chưa có dinh dưỡng:', error);
        throw error;
    }
};
export const getRecipeDetailForAdmin = async (recipeId) => {
    try {
        const response = await axios.get(`${RECIPE_ENDPOINTS.GET_DETAIL_FOR_ADMIN}/${recipeId}`, {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết công thức:', error);
        throw error;
    }
};
export const addRecipe = async (formData) => {
    try {
        const response = await axios.post(RECIPE_ENDPOINTS.CREATE_RECIPE, formData, {

        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm món ăn:', error);
        throw error;
    }
};
export const updateRecipe = async (recipeId, formData) => {
    try {
        const response = await axios.put(`${RECIPE_ENDPOINTS.UPDATE_RECIPE}/${recipeId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật món ăn:', error);
        throw error;
    }
};