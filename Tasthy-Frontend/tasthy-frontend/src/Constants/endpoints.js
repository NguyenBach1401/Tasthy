const BASE_URL = 'https://localhost:5000/api';

export const USER_ENDPOINTS = {
    REGISTER: `${BASE_URL}/User/register`,
    LOGIN: `${BASE_URL}/User/login`,
    PROFILE: `${BASE_URL}/User/profile`,
    GET_ALL: `${BASE_URL}/User`,
    UPDATE_PROFILE: `${BASE_URL}/User/update-profile`,
    GET_HEALTH: `${BASE_URL}/User/health-summary`
};
export const RECIPE_ENDPOINTS = {
    GET_ALL_RECIPES: `${BASE_URL}/Recipe/getall`,
    GET_RECIPE_BY_ID: `${BASE_URL}/Recipe/getbyId`,
    GET_RECIPE_BY_TAG: `${BASE_URL}/Recipe/getbyTag`,
    GET_RECIPE_FOR_ADMIN: `${BASE_URL}/Recipe/all`,
    GET_RECIPE_NO_NUTRITION: `${BASE_URL}/Recipe/withoutNutrition`,
    GET_DETAIL_FOR_ADMIN: `${BASE_URL}/Recipe/adminbyid`,
    CREATE_RECIPE: `${BASE_URL}/Recipe/create`,
    UPDATE_RECIPE: `${BASE_URL}/Recipe/update`,
    HEALTH: `${BASE_URL}/Recipe/health`,
    FROM_USER: `${BASE_URL}/Recipe/from-user`,
    SUGGEST: `${BASE_URL}/Recipe/suggest-by-taste`,
    SUGGEST_BY_INGREDIENTS: `${BASE_URL}/Recipe/suggest-by-ingredients`,
    SEARCH_RECIPE: `${BASE_URL}/Recipe/search`
}
export const SELECTED_RECIPE_ENDPOINTS = {
    SELECTED_RECIPE: `${BASE_URL}/SelectedMeals/`,
    GETALL_SELECTED: `${BASE_URL}/SelectedMeals/`,
    CUSTOM_RECIPE: `${BASE_URL}/SelectedMeals/custom`,
}
export const FAVORITE_ENDPOINTS = {
    ADD_FAVOR: `${BASE_URL}/Favorite/add`,
    REMOVE_FAVOR: `${BASE_URL}/Favorite/remove`,
    GET_FAVOR: `${BASE_URL}/Favorite/getFavor`,
    GET_TOP: `${BASE_URL}/Favorite/top-favorites`
}
export const COMMENT_ENDPOINT = {
    GET: `${BASE_URL}/Comment/comments`,
    ADD: `${BASE_URL}/Comment/add`,
    DELETE: `${BASE_URL}/Comment/delete`,
    UPDATE: `${BASE_URL}/Comment/update`
}
export const TAG_ENDPOINT = {
    GET: `${BASE_URL}/Tag`,
    GET_ALL: `${BASE_URL}/Tag/search`,
    CREATE: `${BASE_URL}/Tag/create`,
    UPDATE: `${BASE_URL}/Tag`,
    DELETE: `${BASE_URL}/Tag`,
    GET_TOP: `${BASE_URL}/Tag/popular`,
}
export const EXERCISE_ENDPOINT = {
    GET: `${BASE_URL}/Exercise`,
    CREATE: `${BASE_URL}/Exercise/create`,
    UPDATE: `${BASE_URL}/Exercise`,
    SUGGEST: `${BASE_URL}/Exercise/suggest`,
    SHUFFLE: `${BASE_URL}/Exercise/suggest/shuffle-one`,
    PICK: `${BASE_URL}/Exercise/pick`
}
export const USER_EXERCISE_ENDPOINT = {
    GET: `${BASE_URL}/UserExercises`,
    CREATE: `${BASE_URL}/UserExercises`,
    CUSTOM: `${BASE_URL}/UserExercises/custom`,
    SAVE: `${BASE_URL}/UserExercises/save`
}
export const ROUTINE_ENDPOINT = {
    GET: `${BASE_URL}/Routines`,
    GET_BY_ID: `${BASE_URL}/Routines`,
}
export const USER_WORKOUT_ENDPOINT = {
    ASSIGN: `${BASE_URL}/UserWorkoutPlan/assign`,
    GET_ALL: `${BASE_URL}/UserWorkoutPlan/progress`,
    GET_DETAIL: `${BASE_URL}/UserWorkoutPlan/`,
    CHECK_IN: `${BASE_URL}/UserWorkoutPlan/checkin`
}
export const JOURNEY_ENDPOINT = {
    FOOD: `${BASE_URL}/journey/food`,
    WORKOUT: `${BASE_URL}/journey/workout`,
}