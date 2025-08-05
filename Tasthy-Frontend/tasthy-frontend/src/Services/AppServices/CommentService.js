import axios from 'axios';
import { COMMENT_ENDPOINT } from '../../Constants/endpoints';

export const addComment = async (userId, recipeId, content) => {
    try {
        const response = await axios.post(COMMENT_ENDPOINT.ADD, {
            userId,
            recipeId,
            content
        });
        return response.data;
    } catch (error) {
        console.error('Error comment:', error);
        throw error;
    }
};
export const delComment = async (commentId, userId) => {
    try {
        const response = await axios.delete(COMMENT_ENDPOINT.DELETE, {
            params: {
                commentId,
                userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error delete comment:', error);
        throw error;
    }
};
export const updateComment = async (commentId, userId, newContent) => {
    try {
        const response = await axios.put(COMMENT_ENDPOINT.UPDATE, {
            commentId,
            userId,
            newContent
        });
        return response.data;
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};
export const getComments = async (recipeId, commentPage = 1, pageSize = 5) => {
    try {
        const response = await axios.get(`${COMMENT_ENDPOINT.GET}/${recipeId}`, {
            params: { commentPage, pageSize },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};
