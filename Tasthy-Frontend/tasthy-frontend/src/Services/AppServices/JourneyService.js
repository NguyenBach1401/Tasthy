import axios from "axios";
import { JOURNEY_ENDPOINT } from "../../Constants/endpoints";

export const getFoodJourney = async (userId, month, year) => {
    const response = await axios.get(JOURNEY_ENDPOINT.FOOD, {
        params: { userId, month, year },
    });
    return response.data;
};

export const getWorkoutJourney = async (userId, month, year) => {
    const response = await axios.get(JOURNEY_ENDPOINT.WORKOUT, {
        params: { userId, month, year },
    });
    return response.data;
};
