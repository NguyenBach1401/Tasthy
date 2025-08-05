import axios from "axios";
import { EXERCISE_ENDPOINT } from "../../Constants/endpoints";
import { USER_EXERCISE_ENDPOINT } from "../../Constants/endpoints";
import qs from 'qs';

export const getAllExercises = async ({
    pageNumber,
    pageSize,
    keyword = '',
    requiresEquipment = null,
    difficultyLevel = '',
    recommendedFor = ''
}) => {
    try {
        const response = await axios.get(EXERCISE_ENDPOINT.GET, {
            params: {
                pageNumber,
                pageSize,
                keyword,
                requiresEquipment,
                difficultyLevel,
                recommendedFor
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài tập:', error);
        throw error;
    }
};

export const createUserExercise = async (token, data) => {
    try {
        const response = await axios.post(USER_EXERCISE_ENDPOINT.CREATE, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo user exercise:', error);
        throw error;
    }
};
export const getAllUserExercises = async (date) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Missing token');

        const response = await axios.get(USER_EXERCISE_ENDPOINT.GET, {
            params: {
                date: date,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài tập người dùng:', error);
        throw error;
    }
};

export const createCustomExercise = async (exerciseData) => {
    const token = localStorage.getItem('token');

    const response = await axios.post(USER_EXERCISE_ENDPOINT.CUSTOM, exerciseData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
export const suggestExercises = async ({ requiresEquipment, muscleGroups, limit = 10 }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(EXERCISE_ENDPOINT.SUGGEST, {
            params: {
                requiresEquipment,
                muscleGroups,
                limit,
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gợi ý bài tập:', error);
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};


export const shuffleOneExercise = async ({ requiresEquipment, muscleGroups, currentExerciseId, excludeIds }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(EXERCISE_ENDPOINT.SHUFFLE, {
            params: {
                requiresEquipment,
                muscleGroups,
                currentExerciseId,
                excludeIds
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};
export const PickExercise = async ({ muscleGroups, excludeExerciseIds, requiresEquipment }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(EXERCISE_ENDPOINT.PICK, {
            params: {
                muscleGroups,
                excludeExerciseIds,
                requiresEquipment
            },
            paramsSerializer: params => qs.stringify(params, { indices: false }),
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: 'Lỗi không xác định' };
    }
};


export const SavePickedExercises = async (pickedList) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(USER_EXERCISE_ENDPOINT.SAVE, pickedList, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


