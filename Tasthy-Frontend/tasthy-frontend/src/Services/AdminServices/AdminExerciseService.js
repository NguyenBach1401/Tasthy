import axios from 'axios';
import { EXERCISE_ENDPOINT } from '../../Constants/endpoints';

export const getAllExercises = async (pageNumber = 1, pageSize = 10, keyword = '', requiresEquipment = false) => {

    try {
        const response = await axios.get(EXERCISE_ENDPOINT.GET, {

            params: {
                pageNumber,
                pageSize,
                keyword,
                requiresEquipment
            },
        });
        if (response.data && Array.isArray(response.data.exercises)) {
            return {
                exercises: response.data.exercises,
                totalRecords: response.data.totalRecords,
            };
        } else {
            console.error('Dữ liệu không hợp lệ:', response.data);
            return { exercises: [], totalRecords: 0 };
        }
    } catch (error) {
        console.error('Lấy danh sách các bài tập thất bại:', error);
        throw error;
    }
}

export async function createExercise(form) {
    const data = new FormData();
    data.append("Name", form.name);
    data.append("Description", form.description);
    data.append("DifficultyLevel", form.difficultyLevel);
    data.append("CaloriesBurnedPerRep", form.caloriesBurnedPerRep);
    data.append("RecommendedFor", form.recommendedFor);
    data.append("RequiresEquipment", form.requiresEquipment);
    if (form.videoUrl) data.append("VideoUrl", form.videoUrl);

    const res = await axios.post(EXERCISE_ENDPOINT.CREATE, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}



export async function updateExercise(id, form) {
    const data = new FormData();

    data.append("Name", form.name);
    data.append("Description", form.description);
    data.append("DifficultyLevel", form.difficultyLevel);
    data.append("CaloriesBurnedPerRep", form.caloriesBurnedPerRep);
    data.append("RecommendedFor", form.recommendedFor);
    data.append("RequiresEquipment", form.requiresEquipment);

    if (form.videoUrl) {
        data.append("VideoUrl", form.videoUrl);
    }

    const response = await axios.put(`${EXERCISE_ENDPOINT.UPDATE}/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
