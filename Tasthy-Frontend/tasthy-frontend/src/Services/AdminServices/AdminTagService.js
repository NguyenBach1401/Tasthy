import axios from 'axios';
import { TAG_ENDPOINT } from '../../Constants/endpoints';

export const getAllTags = async (token, pageNumber = 1, pageSize = 10, keyword = '') => {
    try {
        const response = await axios.get(TAG_ENDPOINT.GET_ALL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                pageNumber,
                pageSize,
                keyword,
            },
        });
        if (response.data && Array.isArray(response.data.tags)) {
            return {
                tags: response.data.tags,
                totalRecords: response.data.totalRecords,
            };
        } else {
            console.error('Dữ liệu không hợp lệ:', response.data);
            return { tags: [], totalRecords: 0 };
        }
    } catch (error) {
        console.error('Lấy danh sách thẻ thất bại:', error);
        throw error;
    }
};

export const createNewTag = async (tagName) => {
    try {
        const response = await axios.post(TAG_ENDPOINT.CREATE, {
            TagName: tagName,
        });
        return response.data;
    } catch (error) {
        console.error('Create tag failed:', error);
        throw error;
    }
}
export const updateTag = async (tagId, tagName) => {
    try {
        const response = await axios.put(`${TAG_ENDPOINT.UPDATE}/${tagId}`, {
            TagName: tagName,
        });
        return response.data;
    } catch (error) {
        console.error('Update tag failed:', error);
        throw error;
    }
};
export const deleteTag = async (tagId) => {
    try {
        const response = await axios.delete(`${TAG_ENDPOINT.DELETE}/${tagId}`);
        return response.data;
    } catch (error) {
        console.error('Delete tag failed:', error);
        throw error;
    }
};