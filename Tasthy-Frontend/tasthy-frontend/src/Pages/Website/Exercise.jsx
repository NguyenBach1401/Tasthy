import React, { useEffect, useState } from 'react';
import {
    Box, Card, CardContent,
    Typography, Grid,
    Stack, Chip,
    Button, Select,
    MenuItem, FormControl,
    InputLabel, Pagination,
    Dialog, DialogTitle, DialogContent,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EventIcon from '@mui/icons-material/Event';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAllExercises } from '../../Services/AppServices/ExerciseService';
import SelectExerciseModal from '../../Component/modal/SelectExerciseModal';
import { toast } from 'react-toastify';
import WorkoutSelector from '../Website/SuggestExercise/WorkoutSelector';
import SuggestedExerciseList from '../Website/SuggestExercise/SuggestExerciseList';
import { suggestExercises } from '../../Services/AppServices/ExerciseService'
import { shuffleOneExercise } from '../../Services/AppServices/ExerciseService';
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { useLocation } from "react-router-dom";


const ExerciseDetail = () => {

    const [exercises, setExercises] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        requiresEquipment: '',
        difficultyLevel: '',
        recommendedFor: ''
    });
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const kw = params.get("kw") || params.get("q") || "";

    const pageSize = 12;
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);
    const fetchData = async () => {
        try {
            const result = await getAllExercises({
                pageNumber: page,
                pageSize,
                keyword: kw.trim(),
                ...filters
            });
            setExercises(result.exercises);
            setTotal(result.totalRecords);
        } catch (err) {
            console.error('Lỗi khi gọi API bài tập:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, filters, search]);

    const handleFilterChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setPage(1);
    };
    const handleOpenModal = (id) => {
        setSelectedExerciseId(id);
    };

    const handleCloseModal = () => {
        setSelectedExerciseId(null);
    };

    const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
    const [suggestexercises, setSuggestExercises] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionFilters, setSuggestionFilters] = useState({
        requiresEquipment: null,
        muscleGroups: [],
    });


    const handleShuffle = async (indexToShuffle) => {
        try {
            const currentExercise = suggestexercises[indexToShuffle];
            const currentExerciseId = currentExercise.exerciseId;

            const requiresEquipment = currentExercise.requiresEquipment;
            const muscleGroups = currentExercise.recommendedFor
                ?.split(',')
                ?.map((g) => g.trim().toLowerCase());

            const newExercise = await shuffleOneExercise({
                requiresEquipment,
                muscleGroups,
                currentExerciseId,
                excludeIds: suggestexercises.map(e => e.exerciseId)
            });

            const updated = [...suggestexercises];
            updated[indexToShuffle] = newExercise;
            setSuggestExercises(updated);
        } catch (err) {
            toast.info(err?.message || 'Không thể đổi bài tập.');
        }
    };
    const handleCloseDialog = () => {
        setShowWorkoutSelector(false);
        setSuggestExercises([]);
        setShowSuggestions(false);
        setSuggestionFilters({ requiresEquipment: null, muscleGroups: [] });
    };


    const handleResetFilters = () => {
        setFilters({
            requiresEquipment: '',
            difficultyLevel: '',
            recommendedFor: ''
        });
    };
    const API_HOST = 'https://localhost:5000';
    return (

        <Box sx={{ p: 4 }}>
            {/* Bộ lọc */}
            <Box sx={{ mb: 3, mt: 2, px: 8 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    alignItems="center"
                    gap={2}
                >
                    {/* Filter group bên trái */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Thiết bị</InputLabel>
                            <Select
                                name="requiresEquipment"
                                value={filters.requiresEquipment}
                                label="Thiết bị"
                                onChange={handleFilterChange}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value={true}>Cần thiết bị</MenuItem>
                                <MenuItem value={false}>Không cần thiết bị</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Độ khó</InputLabel>
                            <Select
                                name="difficultyLevel"
                                value={filters.difficultyLevel}
                                label="Độ khó"
                                onChange={handleFilterChange}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="1">Rất dễ</MenuItem>
                                <MenuItem value="2">Dễ</MenuItem>
                                <MenuItem value="3">Trung bình</MenuItem>
                                <MenuItem value="4">Khó</MenuItem>
                                <MenuItem value="5">Rất khó</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Nhóm cơ</InputLabel>
                            <Select
                                name="recommendedFor"
                                value={filters.recommendedFor}
                                label="Nhóm cơ"
                                onChange={handleFilterChange}
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="chest">Ngực</MenuItem>
                                <MenuItem value="legs">Chân</MenuItem>
                                <MenuItem value="arms">Tay</MenuItem>
                                <MenuItem value="core">Cơ core</MenuItem>
                                <MenuItem value="back">Lưng</MenuItem>
                            </Select>
                        </FormControl>
                        {(filters.requiresEquipment !== '' ||
                            filters.difficultyLevel !== '' ||
                            filters.recommendedFor !== '') && (
                                <Button
                                    variant="contained"
                                    onClick={handleResetFilters}
                                    sx={{
                                        backgroundColor: '#6366f1',
                                        color: '#fff',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        px: 2.5,
                                        py: 1,
                                        '&:hover': {
                                            backgroundColor: '#4f46e5',
                                        }
                                    }}
                                    startIcon={<AutorenewIcon />}
                                >
                                    Reset
                                </Button>
                            )}
                    </Stack>

                    {/* Nút bên phải */}
                    <Button
                        variant="contained"
                        startIcon={<FitnessCenterIcon />}
                        onClick={() => setShowWorkoutSelector(true)}
                        sx={{
                            backgroundColor: '#6366f1',
                            color: '#fff',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                            '&:hover': {
                                backgroundColor: '#4f46e5',
                            }
                        }}
                    >
                        Đề xuất tập luyện
                    </Button>
                </Box>
            </Box>

            {/* Modal chọn môi trường và nhóm cơ */}
            <Dialog open={showWorkoutSelector} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {showSuggestions ? 'Danh sách bài tập đề xuất' : 'Chọn thiết bị & nhóm cơ'}
                </DialogTitle>
                <DialogContent>
                    {!showSuggestions ? (
                        <WorkoutSelector
                            onContinue={async ({ requiresEquipment, muscleGroups }) => {
                                try {
                                    const res = await suggestExercises({ requiresEquipment, muscleGroups });
                                    setSuggestExercises(res);
                                    setSuggestionFilters({ requiresEquipment, muscleGroups });
                                    setShowSuggestions(true);
                                } catch (error) {
                                    toast.info('Không thể đề xuất bài tập.');
                                }
                            }}
                        />
                    ) : (
                        <SuggestedExerciseList
                            exercises={suggestexercises}
                            setExercises={setSuggestExercises}
                            onShuffle={handleShuffle}
                            requiresEquipment={suggestionFilters.requiresEquipment}
                            onRemove={(index) => {
                                const updated = [...suggestexercises];
                                updated.splice(index, 1);
                                setSuggestExercises(updated);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Grid container spacing={2} justifyContent="center">
                {exercises.map((exercise) => (
                    <Grid item key={exercise.exerciseId}>
                        <Card
                            sx={{
                                maxWidth: 600,
                                width: '100%',
                                p: 2,
                                borderRadius: 4,
                                boxShadow: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardContent>
                                <Typography variant="h4" gutterBottom noWrap>
                                    {exercise.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        fontSize: 16,
                                        minHeight: '3em',
                                        minWidth: '35em'
                                    }}
                                >
                                    {exercise.description}
                                </Typography>

                                <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
                                    <Chip
                                        icon={<WhatshotIcon sx={{ fontSize: 20 }} />}
                                        label={`Độ khó: ${exercise.difficultyLevel}`}
                                        color="warning"
                                        sx={{ fontSize: 16, py: 0.8, height: 'auto' }}
                                    />
                                    <Chip
                                        icon={<FitnessCenterIcon sx={{ fontSize: 20 }} />}
                                        label={exercise.requiresEquipment ? 'Cần thiết bị' : 'Không'}
                                        color={exercise.requiresEquipment ? 'primary' : 'success'}
                                        sx={{ fontSize: 16, py: 0.8, height: 'auto' }}
                                    />
                                    <Chip
                                        icon={<WhatshotIcon sx={{ fontSize: 20 }} />}
                                        label={`~${exercise.caloriesBurnedPerRep} cal/lần`}
                                        color="secondary"
                                        sx={{ fontSize: 16, py: 0.8, height: 'auto' }}
                                    />
                                </Stack>


                                {exercise.videoUrl && (
                                    <Box sx={{ mb: 1 }}>
                                        {exercise.videoUrl.includes('youtube.com') ? (
                                            <Box sx={{ position: 'relative', paddingTop: '56.25%', height: 0 }}>
                                                <iframe
                                                    src={exercise.videoUrl.replace('watch?v=', 'embed/')}
                                                    title="Video hướng dẫn"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <video
                                                src={`${API_HOST}${exercise.videoUrl}`}
                                                controls
                                                style={{ width: '104%', height: 300, borderRadius: 8 }}
                                            />
                                        )}
                                    </Box>
                                )}
                            </CardContent>

                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleOpenModal(exercise.exerciseId)}
                                >
                                    Chọn
                                </Button>
                            </Box>
                            <SelectExerciseModal
                                open={Boolean(selectedExerciseId)}
                                onClose={handleCloseModal}
                                exerciseId={selectedExerciseId}
                            />
                        </Card>


                    </Grid>

                ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={Math.ceil(total / pageSize)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                />
            </Box>

        </Box>

    );
};


export default ExerciseDetail;
