import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import AdminLayout from './Layouts/AdminLayout';
import AdminRoute from './routes/AdminRoute';
import AdminUserList from './Pages/Admin/UserStatistic';
import Login from './Pages/Website/Login';
import Register from './Pages/Website/Register';
import AdminTagList from './Pages/Admin/tag/TagStatistic';
import AdminExerciseList from './Pages/Admin/Exercise';
import RecipeAdminTabs from './Pages/Admin/recipe/RecipeStatistic';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (

        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={2000} />
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />


                <Route path="/*" element={<MainLayout />} />


                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route path="users" element={<AdminUserList />} />
                    <Route path="tags" element={<AdminTagList />} />
                    <Route path="exercises" element={<AdminExerciseList />} />
                    <Route path="recipes" element={<RecipeAdminTabs />} />
                    {/* Có thể thêm các route admin khác ở đây */}
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
