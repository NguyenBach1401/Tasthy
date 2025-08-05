import { USER_WORKOUT_ENDPOINT } from "../../Constants/endpoints";
import axios from "axios";

export const assignRoutine = async (userId, routineId) => {
    try {
        const response = await axios.post(USER_WORKOUT_ENDPOINT.ASSIGN, {
            userId,
            routineId
        });
        return response.data;
    } catch (error) {
        console.error("Error assigning routine:", error);
        throw error;
    }
};
export const getUserWorkoutPlansWithProgress = async (userId, params) => {
    try {
        const response = await axios.get(`${USER_WORKOUT_ENDPOINT.GET_ALL}/${userId}`, {
            params: {
                pageNumber: params.pageNumber,
                pageSize: params.pageSize,
                goal: params.goal || '',
                difficultyLevel: params.difficultyLevel || '',
                isComplete: params.isComplete !== undefined ? params.isComplete : null
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user workout plans with progress:', error);
        throw error;
    }
};
export const getRoutineFullDetail = async (userWorkoutPlanId) => {
    const response = await axios.get(`${USER_WORKOUT_ENDPOINT.GET_DETAIL}${userWorkoutPlanId}/detail`, {
    });
    return response.data;
};
export const checkInRoutineDay = async (userWorkoutPlanId) => {
    return await axios.post(USER_WORKOUT_ENDPOINT.CHECK_IN, { userWorkoutPlanId });
};
