import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    LinearProgress,
    Paper,
    Button
} from '@mui/material';
import CheatDayAddRecipe from "./CheatDay";
import { getUserMealsByDate } from "../../Services/AppServices/RecipeService";
import { getProfile } from '../../Services/AppServices/UserService';
import { toast } from 'react-toastify';

const SelectedRecipeList = ({ token }) => {
    const [filterDate, setFilterDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [openCheatModal, setOpenCheatModal] = useState(false);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bmr, setBmr] = useState(null);
    const [tdee, setTdee] = useState(null);
    const [caloriesGoal, setCaloriesGoal] = useState(null);

    const fetchUserMeals = async () => {
        setLoading(true);
        try {
            const formattedDate = new Date(filterDate).toISOString();
            const data = await getUserMealsByDate(token, formattedDate);
            setFilteredRecipes(data);
        } catch (error) {
            console.error('Failed to fetch meals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterDate) {
            fetchUserMeals();
        }
    }, [filterDate]);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const data = await getProfile(token);
                setBmr(Math.round(data.bmr));
                setTdee(Math.round(data.tdee));
                setCaloriesGoal(Math.round(data.caloriesGoal));
            } catch (err) {
                console.error('Không thể lấy chỉ số BMR/TDEE:', err);
            }
        };

        fetchProfile();
    }, []);

    const totalCalories = filteredRecipes.reduce((sum, r) => sum + r.calories * r.quantity, 0);
    const totalFat = filteredRecipes.reduce((sum, r) => sum + r.fat * r.quantity, 0);
    const totalCarbs = filteredRecipes.reduce((sum, r) => sum + r.carbs * r.quantity, 0);
    const totalProtein = filteredRecipes.reduce((sum, r) => sum + r.protein * r.quantity, 0);

    const calorieValues = filteredRecipes.map(r => r.calories);
    const maxCalories = Math.max(...calorieValues);
    const minCalories = Math.min(...calorieValues);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                    size="small"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenCheatModal(true)}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                >
                    + Cheat Meal
                </Button>
            </Box>

            <CheatDayAddRecipe
                open={openCheatModal}
                onClose={() => setOpenCheatModal(false)}
                token={token}
                onSuccess={() => {
                    toast.success('Thêm món ăn Cheat Meal thành công!');
                    fetchUserMeals();
                }}
            />

            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
                    Danh sách món ăn đã chọn
                </Typography>

                <Table>
                    <TableHead sx={{ backgroundColor: '#d0f5c3' }}>
                        <TableRow>
                            {['Tên món', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)', 'Số lượng'].map((title, idx) => (
                                <TableCell key={idx} align="center">
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: 20 }}>
                                        {title}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecipes.map((recipe, index) => (
                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#fafafa' }, fontSize: 18 }}>
                                <TableCell align="center">{recipe.name}</TableCell>
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            border: `2px solid ${recipe.calories === maxCalories
                                                ? '#f87171'
                                                : recipe.calories === minCalories
                                                    ? '#4ade80'
                                                    : '#60a5fa'
                                                }`,
                                            borderRadius: 2,
                                            px: 1.5,
                                            py: 0.5,
                                            fontWeight: 'bold',
                                            color:
                                                recipe.calories === maxCalories
                                                    ? '#f87171'
                                                    : recipe.calories === minCalories
                                                        ? '#4ade80'
                                                        : '#60a5fa',
                                            fontSize: 18
                                        }}
                                    >
                                        {recipe.calories.toFixed(1)}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">{recipe.fat.toFixed(1)}</TableCell>
                                <TableCell align="center">{recipe.carbs.toFixed(1)}</TableCell>
                                <TableCell align="center">{recipe.protein.toFixed(1)}</TableCell>
                                <TableCell align="center">{recipe.quantity}</TableCell>
                            </TableRow>
                        ))}
                        {filteredRecipes.length > 0 && (
                            <TableRow sx={{ backgroundColor: '#e0f7fa', fontSize: 18 }}>
                                <TableCell align="center"><strong>Tổng</strong></TableCell>
                                <TableCell align="center"><strong>{totalCalories.toFixed(1)}</strong></TableCell>
                                <TableCell align="center"><strong>{totalFat.toFixed(1)}</strong></TableCell>
                                <TableCell align="center"><strong>{totalCarbs.toFixed(1)}</strong></TableCell>
                                <TableCell align="center"><strong>{totalProtein.toFixed(1)}</strong></TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: '#fafafa',
                    textAlign: 'center',
                    mb: 3
                }}
            >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Tổng quan lượng Calories
                </Typography>

                {/* BMR */}
                <LinearProgress
                    variant="determinate"
                    value={Math.min((totalCalories / bmr) * 100, 100)}
                    sx={{
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: totalCalories < bmr ? '#ff9800' : '#4caf50'
                        },
                        mb: 1
                    }}
                />
                <Typography sx={{ mb: 2 }} color={totalCalories < bmr ? 'warning.main' : 'success.main'} fontWeight={500}>
                    {totalCalories < bmr
                        ? `🔥 Bạn cần nạp thêm ${Math.round(bmr - totalCalories)} calories để đạt BMR!`
                        : '✅ Bạn đã đạt lượng calories cần thiết cho BMR hôm nay!'}
                </Typography>

                {/* TDEE */}
                <LinearProgress
                    variant="determinate"
                    value={Math.min((totalCalories / tdee) * 100, 100)}
                    sx={{
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: totalCalories < tdee ? '#ff9800' : '#4caf50'
                        },
                        mb: 1
                    }}
                />
                <Typography sx={{ mb: 2 }} color={totalCalories < tdee ? 'warning.main' : 'success.main'} fontWeight={500}>
                    {totalCalories < tdee
                        ? `🔥 Bạn cần nạp thêm ${Math.round(tdee - totalCalories)} calories để đạt TDEE!`
                        : '✅ Bạn đã đạt lượng calories cần thiết cho TDEE hôm nay!'}
                </Typography>

                {/* Calories Goal */}
                <LinearProgress
                    variant="determinate"
                    value={Math.min((totalCalories / caloriesGoal) * 100, 100)}
                    sx={{
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: totalCalories < caloriesGoal ? '#ff9800' : '#4caf50'
                        },
                        mb: 1
                    }}
                />
                <Typography color={totalCalories < caloriesGoal ? 'warning.main' : 'success.main'} fontWeight={500}>
                    {totalCalories < caloriesGoal
                        ? `🔥 Bạn cần nạp thêm ${Math.round(caloriesGoal - totalCalories)} calories để đạt mục tiêu!`
                        : '✅ Bạn đã đạt lượng calories cần thiết hôm nay!'}
                </Typography>
            </Paper>
        </Box>
    );
};

export default SelectedRecipeList;
