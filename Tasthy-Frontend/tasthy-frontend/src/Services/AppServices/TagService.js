import { TAG_ENDPOINT } from "../../Constants/endpoints";
import axios from "axios";

export const getTag = async (keyword) => {
    try {
        const response = await axios.get(TAG_ENDPOINT.GET, {
            params: { keyword }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tag:', error);
        return [];
    }
}

export const getPopularTags = async () => {
    try {
        const response = await axios.get(TAG_ENDPOINT.GET_TOP);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy top tag:', error);
        throw error;
    }
};