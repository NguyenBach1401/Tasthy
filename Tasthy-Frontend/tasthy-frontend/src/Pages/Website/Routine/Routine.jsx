import React, { useEffect, useState } from 'react';
import { getRoutines } from '../../../Services/AppServices/RoutineService';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Pagination,
    CircularProgress,
    Chip,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Button,
    Container,
    Paper, CardMedia
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useNavigate } from 'react-router-dom';

const RoutineList = () => {
    const [routines, setRoutines] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [goalFilter, setGoalFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchRoutines();
    }, [page, goalFilter, difficultyFilter]);

    const fetchRoutines = async () => {
        setLoading(true);
        try {
            const response = await getRoutines({
                pageNumber: page,
                pageSize,
                goal: goalFilter || null,
                difficulty: difficultyFilter || null,
            });
            setRoutines(response.items || []);
            setTotalItems(response.totalItems || 0);
        } catch (error) {
            console.error('Error loading routines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (_, value) => setPage(value);

    const renderDifficulty = (level) => {
        const activeColor = '#ff5722';
        const inactiveColor = '#e0e0e0';
        return (
            <Tooltip title={`Độ khó: ${level}/3`}>
                <Stack direction="row" spacing={0.5}>
                    {[1, 2, 3].map((i) => (
                        <WhatshotIcon
                            key={i}
                            style={{ color: i <= level ? activeColor : inactiveColor }}
                        />
                    ))}
                </Stack>
            </Tooltip>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                <Typography variant="h4" textAlign="center" fontWeight={600} mb={3}>
                    📋 Danh sách bài tập
                </Typography>

                {/* Bộ lọc */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 4,
                        background: '#ffffff',
                        boxShadow: 10,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        <FormControl sx={{ minWidth: 240, flex: 1 }}>
                            <InputLabel id="goal-filter-label">🎯 Mục tiêu</InputLabel>
                            <Select
                                labelId="goal-filter-label"
                                value={goalFilter}
                                label="Mục tiêu"
                                onChange={(e) => setGoalFilter(e.target.value)}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="Tăng cơ">Tăng cơ</MenuItem>
                                <MenuItem value="Giảm cân">Giảm cân</MenuItem>
                                <MenuItem value="Giữ dáng">Giữ dáng</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 240, flex: 1 }}>
                            <InputLabel id="difficulty-filter-label">📈 Độ khó</InputLabel>
                            <Select
                                labelId="difficulty-filter-label"
                                value={difficultyFilter}
                                label="Độ khó"
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="1">Dễ</MenuItem>
                                <MenuItem value="2">Trung bình</MenuItem>
                                <MenuItem value="3">Khó</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* Danh sách Routine */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {routines.map((routine) => (
                            <Grid item xs={12} sm={6} md={4} key={routine.routineId}>
                                <Card
                                    sx={{
                                        borderRadius: 5,
                                        boxShadow: 3,
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="/img/workout.jpg"
                                        alt="Routine Image"
                                        sx={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                                    />

                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {routine.name}
                                        </Typography>

                                        <Chip
                                            label={routine.goal}
                                            color="primary"
                                            variant="filled"
                                            sx={{ mb: 1, fontSize: 20 }}
                                        />

                                        <Box mb={1}>
                                            <Typography variant="h6" fontWeight={400} gutterBottom>
                                                Độ khó
                                            </Typography>{renderDifficulty(Number(routine.difficultyLevel))}</Box>

                                        <Typography variant="body2" fontSize={20}>📅 Ngày: {routine.daysPerWeek}</Typography>
                                        <Typography variant="body2" fontSize={20}>⏳ Số lần thực hiện: {routine.durationWeeks} lần</Typography>
                                    </CardContent>

                                    <Box textAlign="center" pb={2}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => navigate(`/routine/${routine.routineId}`)}
                                            sx={{ borderRadius: 2, px: 3 }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Box>
                                </Card>

                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Pagination */}
                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={Math.ceil(totalItems / pageSize)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default RoutineList;