import axios from 'axios';
import { RECIPE_ENDPOINTS } from '../../Constants/endpoints';
import { SELECTED_RECIPE_ENDPOINTS } from '../../Constants/endpoints';

export const getAllRecipes = async () => {
    try {
        const response = await axios.get(RECIPE_ENDPOINTS.GET_ALL_RECIPES);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const getRecipeByID = async (id, userId, commentPage, pageSize) => {
    try {
        const response = await axios.get(`${RECIPE_ENDPOINTS.GET_RECIPE_BY_ID}/${id}`, {
            params: {
                userId,
                commentPage: 1,
                pageSize: 5
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}
export const getRecipesByTag = async (tagName, pageNumber, pageSize) => {
    try {
        const response = await axios.get(RECIPE_ENDPOINTS.GET_RECIPE_BY_TAG, {
            params: {
                tagName,
                pageNumber,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};
export const selectedRecipe = async (userID, recipeID, noRecipe) => {
    try {
        const response = await axios.post(SELECTED_RECIPE_ENDPOINTS.SELECTED_RECIPE, {
            userID,
            recipeID,
            noRecipe
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}
export const getUserMealsByDate = async (token, date) => {
    try {
        const response = await axios.get(SELECTED_RECIPE_ENDPOINTS.GETALL_SELECTED, {
            params: {
                date,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user meals:', error);
        throw error;
    }
};

export const createCheatMeal = async (token, mealData) => {
    try {
        const response = await axios.post(
            SELECTED_RECIPE_ENDPOINTS.CUSTOM_RECIPE,
            mealData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating cheat meal:', error.response?.data || error.message);
        throw error;
    }
};

export const getHealthRecipe = async () => {
    try {
        const response = await axios.get(RECIPE_ENDPOINTS.HEALTH);
        return response.data;
    }
    catch (error) {
        console.error('Lỗi khi lấy recipe:', error);
        throw error;
    }
}

export const getRecipeFromUser = async () => {
    try {
        const response = await axios.get(RECIPE_ENDPOINTS.FROM_USER);
        return response.data;
    }
    catch (error) {
        console.error('Lỗi khi lấy recipe:', error);
        throw error;
    }
}

export const getSuggestRecipe = async (recipeId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            RECIPE_ENDPOINTS.SUGGEST,
            { recipeId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy recipe:', error);
        throw error;
    }
};
export const suggestByIngredients = async (ingredients) => {
    try {
        const response = await axios.post(
            RECIPE_ENDPOINTS.SUGGEST_BY_INGREDIENTS,
            { ingredients }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gợi ý theo nguyên liệu:', error);
        throw error;
    }
};
export const searchRecipes = async (
    pageNumber = 1,
    pageSize = 12,
    keyword = ""
) => {
    const { data } = await axios.get(
        RECIPE_ENDPOINTS.SEARCH_RECIPE,
        { params: { pageNumber, pageSize, keyword } }
    );
    return data;
};