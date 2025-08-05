import axios from 'axios'
import { ROUTINE_ENDPOINT } from '../../Constants/endpoints'

export const getRoutines = async ({ pageNumber = 1, pageSize = 10, goal = null, difficulty = null }) => {
    try {
        const response = await axios.get(ROUTINE_ENDPOINT.GET, {
            params: {
                pageNumber,
                pageSize,
                goal,
                difficulty
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching routines:', error);
        throw error;
    }
};

export const getRoutineDetail = async (id, userId) => {
    try {
        const response = await axios.get(`${ROUTINE_ENDPOINT.GET_BY_ID}/${id}`,
            {
                params: { userId }
            });

        return response.data;
    } catch (error) {
        console.error(`Error fetching routine detail with ID ${id}:`, error);
        throw error;
    }
};