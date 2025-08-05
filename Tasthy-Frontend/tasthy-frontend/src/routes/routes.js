
import { Routes, Route } from 'react-router-dom';
import RecipeList from '../Pages/Website/Home';
import RecipeDetail from '../Pages/Website/recipedetail';
import RecipeByTag from '../Pages/Website/recipebytag';
import AddRecipeForm from '../Pages/Website/AddRecipe';
import FavoriteList from '../Pages/User/MyFavor';
import Profile from '../Pages/User/Profile';
import ExerciseDetail from '../Pages/Website/Exercise'
import ExerciseGrid from '../Pages/Website/allExercise';
import SelectedRecipeList from '../Pages/User/SelectedRecipeList';
import SelectedExercise from '../Pages/User/SelectedExercise';
import RoutineList from '../Pages/Website/Routine/Routine';
import RoutineDetail from '../Pages/Website/Routine/RoutineDetail';
import UserWorkoutPlanPage from '../Pages/User/UserWorkoutPlan';
import HealthPage from '../Pages/Website/Health/HealthPage';
import SearchPage from '../Pages/Website/Recipe/SearchPage';

function AppRoutes() {
    const token = localStorage.getItem('token');
    return (
        <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/tag/:tagName" element={<RecipeByTag />} />
            <Route path="/newrecipe" element={<AddRecipeForm />} />
            <Route path="/exercise" element={<ExerciseDetail />} />
            <Route path="/exercise2" element={<ExerciseGrid />} />
            <Route path="/selectedrecipe" element={<SelectedRecipeList token={token} />} />
            <Route path="/selectedexercise" element={<SelectedExercise />} />
            <Route path="/myfavor" element={<FavoriteList token={token} />} />
            <Route path="/profile" element={<Profile token={token} />} />
            <Route path="/routine" element={<RoutineList />} />
            <Route path="/routine/:id" element={<RoutineDetail />} />
            <Route path="workoutplan" element={<UserWorkoutPlanPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/search" element={<SearchPage />} />


        </Routes>
    );
}

export default AppRoutes;
