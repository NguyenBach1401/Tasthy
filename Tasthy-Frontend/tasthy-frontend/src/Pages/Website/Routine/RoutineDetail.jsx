import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Divider,
    Grid, Paper, Button
} from '@mui/material';
import { getRoutineDetail } from '../../../Services/AppServices/RoutineService';
import { toast } from 'react-toastify';
import { assignRoutine } from '../../../Services/AppServices/UserWorkoutPlanService';


const RoutineDetail = () => {
    const { id } = useParams();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutine = async () => {
            if (!id) return;

            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.warn("User not logged in");
                return;
            }

            try {
                const res = await getRoutineDetail(id, userId);
                setRoutine(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, [id]);
    const handleAssignRoutine = async () => {
        const userId = localStorage.getItem("userId");
        try {
            await assignRoutine(userId, id);
            toast.success("Đăng ký thành công!");
            setRoutine({ ...routine, isAssigned: true });
        } catch (error) {
            toast.error("Đăng ký thất bại");
        }
    };

    if (loading) {
        return <Typography align="center" mt={5}>Đang tải dữ liệu...</Typography>;
    }

    if (!routine) {
        return <Typography align="center" mt={5}>Không tìm thấy routine.</Typography>;
    }

    return (
        <Box maxWidth="lg" mx="auto" p={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {routine.name}
            </Typography>
            <Box sx={{
                display: 'flex', borderRadius: 5,
                justifyContent: 'space-around',
                boxShadow: 5,
                p: 2,
                mb: 4,
                gap: 10

            }}>

                <Typography variant="subtitle1" gutterBottom fontSize={20}>
                    Mục tiêu: <strong>{routine.goal} </strong>
                </Typography>
                <Typography variant="subtitle1" gutterBottom fontSize={20}>
                    Độ khó: <strong>{routine.difficultyLevel} </strong>
                </Typography>
                <Typography variant="subtitle1" gutterBottom fontSize={20}>
                    Số ngày: <strong>{routine.daysPerWeek} </strong>
                </Typography>
                <Typography variant="subtitle1" gutterBottom fontSize={20}>
                    Số lần thực hiện: <strong>{routine.durationWeeks} </strong>
                </Typography>

            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid
                container
                spacing={3}
                justifyContent="center"
            >
                {routine.days.map((day) => (
                    <Grid
                        item
                        key={day.routineDay}
                        xs={12}
                        sm={6}
                        md={4}
                        sx={{ minWidth: 360 }}
                    >
                        <Paper elevation={4} sx={{ borderRadius: 4, p: 2 }}>
                            <Typography
                                variant="h6"
                                align="center"
                                gutterBottom
                                sx={{ fontWeight: 'bold', fontSize: 22 }}
                            >
                                🗓️ Ngày {day.routineDay}
                            </Typography>

                            {day.exercises.map((exercise, idx) => (
                                <Card key={exercise.exerciseId} sx={{ my: 1 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontSize={18}>
                                            {idx + 1}. {exercise.name}
                                        </Typography>
                                        <Typography variant="body2" fontSize={16}>
                                            🔁 Reps: {exercise.reps} &nbsp;&nbsp; 📦 Sets: {exercise.sets}
                                        </Typography>
                                        <Typography variant="body2" fontSize={16}>
                                            🔥 Calories/reps: {exercise.caloriesPerRep}
                                        </Typography>
                                        <Typography variant="body2" fontSize={16}>
                                            🧮 Tổng calo tiêu thụ: {Math.round(exercise.totalCalories)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}

                        </Paper>

                    </Grid>
                ))}
                {routine && (
                    <Box mb={3} display="flex" justifyContent="center">
                        {routine.isAssigned ? (
                            <Typography color="primary" fontSize={20}>Bạn đã đăng ký routine này</Typography>
                        ) : (
                            <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={handleAssignRoutine}
                                sx={{ fontSize: 18, px: 4, borderRadius: 10 }}
                            >
                                Đăng ký Routine này
                            </Button>
                        )}
                    </Box>
                )}
            </Grid>

        </Box>
    );
};

export default RoutineDetail;
