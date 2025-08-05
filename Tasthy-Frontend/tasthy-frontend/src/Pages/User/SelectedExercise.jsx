import React, { useState, useEffect } from "react";
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
    Paper, Button
} from '@mui/material';
import CustomExerciseModal from "./CustomExercise";
import { getAllUserExercises } from '../../Services/AppServices/ExerciseService';
import { toast } from 'react-toastify';
import { getProfile } from '../../Services/AppServices/UserService';


const SelectedExercise = () => {
    const [filterDate, setFilterDate] = useState(() => {
        // Mặc định là ngày hôm nay ngay khi khởi tạo
        const today = new Date().toISOString().split('T')[0];
        return today;
    });

    const [openCheatModal, setOpenCheatModal] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [tdee, setTdee] = useState(null);
    const [bmr, setBmr] = useState(null);


    const fetchExercises = async () => {
        try {
            const isoDate = new Date(filterDate).toISOString();
            const result = await getAllUserExercises(isoDate);
            setSelectedExercises(result);
        } catch (err) {
            toast.error('Không thể tải bài tập!');
            console.error(err);
        }
    };

    // 🟩 Gọi API mỗi khi filterDate thay đổi
    useEffect(() => {
        if (filterDate) {
            fetchExercises();
        }
    }, [filterDate]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchProfile = async () => {
            try {

                const data = await getProfile(token);
                setBmr(Math.round(data.bmr));
                setTdee(Math.round(data.tdee));
            } catch (err) {
                console.error('Không thể lấy chỉ số BMR/TDEE:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setFilterDate(selectedDate);
    };

    const caloriesList = selectedExercises.map(ex =>
        Math.ceil(ex.caloriesPerRep * ex.reps * ex.sets)
    );
    const maxCalories = Math.max(...caloriesList);
    const minCalories = Math.min(...caloriesList);

    const targetCalories =
        tdee !== null && bmr !== null ? Math.round((tdee - bmr) * 0.35) : null;

    const totalBurned = selectedExercises.reduce(
        (sum, ex) => sum + Math.ceil(ex.caloriesPerRep * ex.reps * ex.sets),
        0
    );

    const progress =
        targetCalories && targetCalories > 0
            ? Math.min((totalBurned / targetCalories) * 100, 100)
            : 0;

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
            <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        size="small"
                        type="date"
                        value={filterDate}
                        onChange={handleDateChange}
                    />
                    <Button variant="contained" color="primary" onClick={() => setOpenCheatModal(true)}>
                        Tạo bài tập
                    </Button>
                </Box>

                <CustomExerciseModal
                    open={openCheatModal}
                    onClose={() => setOpenCheatModal(false)}
                    onSuccess={fetchExercises}
                />
            </>

            <Paper elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#d0f5c3' }}>
                            <TableCell sx={{ fontSize: 20 }}><strong>Tên bài tập</strong></TableCell>
                            <TableCell sx={{ fontSize: 20 }} align="center"><strong>Calories/rep</strong></TableCell>
                            <TableCell sx={{ fontSize: 20 }} align="center"><strong>Số rep</strong></TableCell>
                            <TableCell sx={{ fontSize: 20 }} align="center"><strong>Số set</strong></TableCell>
                            <TableCell sx={{ fontSize: 20 }} align="center"><strong>Tổng calo tiêu thụ</strong></TableCell>
                            <TableCell sx={{ fontSize: 20 }} align="center"><strong>Ngày tập</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {selectedExercises.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
                            </TableRow>
                        ) : (
                            selectedExercises.map((exercise, index) => {
                                const totalCalories = Math.ceil(exercise.caloriesPerRep * exercise.reps * exercise.sets);
                                const formattedDate = new Date(exercise.exerciseDate).toLocaleDateString('vi-VN');

                                let caloriesColor = '#60a5fa'; // mặc định: xanh dương
                                if (totalCalories === maxCalories) caloriesColor = '#f87171'; // đỏ
                                else if (totalCalories === minCalories) caloriesColor = '#4ade80'; // xanh lá

                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f0fdf4',
                                                cursor: 'pointer',
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: 18 }}>{exercise.exerciseName}</TableCell>
                                        <TableCell sx={{ fontSize: 18 }} align="center">{exercise.caloriesPerRep}</TableCell>
                                        <TableCell sx={{ fontSize: 18 }} align="center">{exercise.reps}</TableCell>
                                        <TableCell sx={{ fontSize: 18 }} align="center">{exercise.sets}</TableCell>
                                        <TableCell sx={{ fontSize: 18 }} align="center">
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    border: `2px solid ${caloriesColor}`,
                                                    borderRadius: 2,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    fontWeight: 'bold',
                                                    color: caloriesColor,
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {totalCalories}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 18 }} align="center">{formattedDate}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}

                        {selectedExercises.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="right">
                                    <strong>Tổng cộng</strong>
                                </TableCell>
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            border: '3px solid #fb923c',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1,
                                            fontWeight: 'bold',
                                            fontSize: '1.3rem',
                                            color: '#fff',
                                            backgroundColor: '#fb923c',
                                            display: 'inline-block',
                                            boxShadow: '0 0 8px rgba(251, 146, 60, 0.7)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                    >
                                        {
                                            selectedExercises.reduce((sum, ex) =>
                                                sum + Math.ceil(ex.caloriesPerRep * ex.reps * ex.sets), 0
                                            )
                                        } kcal
                                    </Box>
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
            {targetCalories && (
                <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {totalBurned} / {targetCalories} kcal –&nbsp;
                        {Math.round(progress)}%
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                transition: 'transform 0.3s',
                                bgcolor:
                                    progress >= 100
                                        ? '#16a34a'
                                        : progress >= 75
                                            ? '#4ade80'
                                            : progress >= 50
                                                ? '#fbbf24'
                                                : '#f87171',
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SelectedExercise;
