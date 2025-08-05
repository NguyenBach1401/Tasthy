import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getRoutineFullDetail, checkInRoutineDay } from '../../Services/AppServices/UserWorkoutPlanService';
import { toast } from 'react-toastify';
import CountdownToMidnight from '../../Component/countdown';

const UserWorkoutPlanDetail = ({ userWorkoutPlanId }) => {
    const [routineDetail, setRoutineDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInLoading, setCheckInLoading] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getRoutineFullDetail(userWorkoutPlanId);
                setRoutineDetail(data);
            } catch (err) {
                toast.error('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [userWorkoutPlanId]);

    const handleCheckIn = async () => {
        try {
            setCheckInLoading(true);
            await checkInRoutineDay(userWorkoutPlanId);
            toast.success('Checkin thành công!');
            const updatedData = await getRoutineFullDetail(userWorkoutPlanId);
            setRoutineDetail(updatedData);
        } catch (err) {
            toast.error('Checkin thất bại.');
        } finally {
            setCheckInLoading(false);
        }
    };

    if (loading) return <CircularProgress />;

    const days = routineDetail.routineDays;

    // Tìm ngày gần nhất đã checkin
    const lastCheckedIndex = days.map(d => d.isCheckedIn).lastIndexOf(true);
    const lastCheckedDay = days[lastCheckedIndex];

    const now = new Date();
    const todayStr = now.toDateString();

    let nextCheckinIndex = -1;
    let showCountdown = false;
    let countdownTargetTime = null;

    if (!lastCheckedDay) {
        nextCheckinIndex = 0;
    } else {
        const checkinDate = new Date(lastCheckedDay.checkinDate);
        const checkinDateStr = checkinDate.toDateString();

        if (checkinDateStr !== todayStr) {
            nextCheckinIndex = lastCheckedIndex + 1;
        } else {
            showCountdown = true;
            const tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            countdownTargetTime = tomorrow;
        }
    }

    const weeksMap = days.reduce((acc, day) => {
        const week = day.weekNumber;
        if (!acc[week]) acc[week] = [];
        acc[week].push(day);
        return acc;
    }, {});

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Lịch tập của bạn
            </Typography>

            {Object.entries(weeksMap).map(([weekNumber, weekDays]) => (
                <Box key={weekNumber} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: 2, minWidth: 1080 }}>
                    <Typography variant="h6" gutterBottom>
                        Lần thứ {weekNumber}
                    </Typography>

                    <Grid container spacing={2}>
                        {weekDays.map((day) => {
                            const globalIndex = days.findIndex(d => d.routineDayNumber === day.routineDayNumber);

                            return (
                                <Grid item xs={12} sm={6} md={4} key={day.routineDayNumber} sx={{ minWidth: 340 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1">
                                                Ngày {day.routineDayNumber} - Lần số {day.weekNumber} - Ngày thứ {day.dayOfWeek}
                                            </Typography>
                                            <ul>
                                                {day.exercises.map(ex => (
                                                    <li key={ex.exerciseId}>
                                                        {ex.name} - {ex.sets} x {ex.reps}
                                                    </li>
                                                ))}
                                            </ul>

                                            {day.isCheckedIn ? (
                                                <Box display="flex" alignItems="center" mt={1} color="green">
                                                    <CheckCircleIcon />
                                                    <Typography variant="body2" ml={1}>Đã hoàn thành</Typography>
                                                </Box>
                                            ) : (
                                                globalIndex === nextCheckinIndex ? (
                                                    <Button
                                                        onClick={handleCheckIn}
                                                        disabled={checkInLoading}
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {checkInLoading ? 'Đang checkin...' : 'Hoàn tất'}
                                                    </Button>
                                                ) : (
                                                    showCountdown && globalIndex === lastCheckedIndex + 1 ? (
                                                        <CountdownToMidnight targetTime={countdownTargetTime} />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                                            Hãy hoàn thành ngày trước để mở khoá
                                                        </Typography>
                                                    )
                                                )
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}
        </Box>
    );
};

export default UserWorkoutPlanDetail;
