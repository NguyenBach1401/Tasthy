
import React, { useState } from 'react';
import {
    Box, Typography,
    IconButton, Button,
    Stack, Tooltip, DialogTitle,
    DialogContent, DialogActions,
    Dialog, TextField, Grid
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { toast } from 'react-toastify';
import { PickExercise } from '../../../Services/AppServices/ExerciseService';
import AddExerciseModal from './AddExerciseModal';
import { SavePickedExercises } from '../../../Services/AppServices/ExerciseService';


const muscleColorMap = {
    Arms: "#f8bbd0",
    Chest: "#d1c4e9",
    Core: "#dcedc8",
    Legs: "#e6ee9c",
    Shoulder: "#b2ebf2",
    Back: "#fff59d",
};
const muscleNameViMap = {
    Arms: "Tay",
    Chest: "Ngực",
    Core: "Bụng",
    Legs: "Chân",
    Shoulder: "Vai",
    Back: "Lưng",
};
const SuggestedExerciseList = ({ exercises, setExercises, onShuffle, onRemove, requiresEquipment }) => {
    const [openVideo, setOpenVideo] = React.useState(null);


    const updateReps = (index, newReps) => {
        const updated = [...exercises];
        updated[index].reps = newReps;
        setExercises(updated);
    };

    const updateSets = (index, newSets) => {
        const updated = [...exercises];
        updated[index].sets = newSets;
        setExercises(updated);
    };

    const [openPickDialog, setOpenPickDialog] = useState(false);
    const [pickOptions, setPickOptions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);



    const handlePick = async (index, exercise) => {
        try {
            setSelectedIndex(index);
            const res = await PickExercise({
                muscleGroups: [exercise.recommendedFor?.toLowerCase()],
                excludeExerciseIds: exercises.map(e => e.exerciseId),
                requiresEquipment: requiresEquipment
            });

            setPickOptions(res || []);
            setOpenPickDialog(true);
        } catch (err) {
            toast.error('Không thể lấy danh sách bài tập.');
            console.error(err);
        }
    };
    const applyPickedExercise = (newExercise) => {
        const updated = [...exercises];
        updated[selectedIndex] = newExercise;
        setExercises(updated);
        setOpenPickDialog(false);
    };
    const handleSaveExercises = async () => {
        const pickedExercises = exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            reps: ex.reps,
            sets: ex.sets,
            durationMinutes: ex.durationMinutes || null,
        }));

        try {
            await SavePickedExercises(pickedExercises);
            toast.success('Đã lưu bài tập thành công!');
        } catch (err) {
            console.error(err);
            toast.error('Lưu bài tập thất bại!');
        }
    };

    return (

        <>

            <Box p={2}>
                {exercises.map((exercise, index) => {
                    const muscleEn = exercise.recommendedFor || "Unknown";
                    const nameVi = muscleNameViMap[muscleEn] ?? muscleEn;
                    const color = muscleColorMap[muscleEn] || "#e0f7fa";
                    const firstChar = nameVi.charAt(0).toUpperCase();

                    return (
                        <Box
                            key={exercise.exerciseId || index}
                            borderBottom="1px solid #e0e0e0"
                            p={1}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                {/* Cột 1: Icon + tên + play */}
                                <Grid item xs={5}>
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            width={24}
                                            height={24}
                                            borderRadius="50%"
                                            bgcolor={color}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            fontWeight="bold"
                                            mr={1.5}
                                            flexShrink={0}
                                        >
                                            {firstChar}
                                        </Box>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                minWidth: '180px'
                                            }}
                                        >
                                            {exercise.name}
                                        </Typography>

                                        {exercise && exercise.videoUrl && (
                                            <>

                                                {(() => {
                                                    const API_HOST = "https://localhost:5000";
                                                    const rawUrl = exercise.videoUrl;
                                                    const videoSrc = rawUrl.startsWith("http")
                                                        ? rawUrl
                                                        : `${API_HOST}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

                                                    return (
                                                        <>
                                                            <Tooltip title="Xem video">
                                                                <IconButton
                                                                    onClick={() => setOpenVideo(videoSrc)}
                                                                    size="small"
                                                                    sx={{ ml: 1, p: 0.5 }}
                                                                >
                                                                    <PlayCircleOutlineIcon color="primary" fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Dialog
                                                                open={openVideo === videoSrc}
                                                                onClose={() => setOpenVideo(null)}
                                                                maxWidth="md"
                                                                fullWidth
                                                            >
                                                                <DialogTitle>Video hướng dẫn</DialogTitle>
                                                                <DialogContent>
                                                                    {/youtube\.com|youtu\.be/.test(videoSrc) ? (
                                                                        <iframe
                                                                            src={
                                                                                videoSrc.includes("watch?v=")
                                                                                    ? videoSrc.replace("watch?v=", "embed/")
                                                                                    : videoSrc
                                                                            }
                                                                            width="100%"
                                                                            height="400"
                                                                            title="Exercise video"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                            allowFullScreen
                                                                            style={{ border: 0, borderRadius: 6 }}
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            src={videoSrc}
                                                                            width="100%"
                                                                            height="400"
                                                                            controls
                                                                            style={{ background: "#000", borderRadius: 6 }}
                                                                        />
                                                                    )}
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => setOpenVideo(null)}>Đóng</Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </>
                                                    );
                                                })()}
                                            </>
                                        )}

                                    </Box>
                                </Grid>

                                {/* Cột 2: Reps */}
                                <Grid item xs={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2" mr={1}>Reps:</Typography>
                                        <Stack spacing={0.5} alignItems="center">
                                            <IconButton size="small" onClick={() => updateReps(index, exercise.reps + 1)} sx={{ height: 24 }}>
                                                <KeyboardArrowUpIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                type="number"
                                                value={exercise.reps}
                                                onChange={(e) => updateReps(index, parseInt(e.target.value) || 0)}
                                                inputProps={{ min: 0, style: { textAlign: 'center', width: 50, height: 32, padding: 4 } }}
                                                size="small"
                                            />
                                            <IconButton size="small" onClick={() => updateReps(index, Math.max(0, exercise.reps - 1))} sx={{ height: 24 }}>
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Grid>

                                {/* Cột 3: Sets */}
                                <Grid item xs={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2" mr={1}>Sets:</Typography>
                                        <Stack spacing={0.5} alignItems="center">
                                            <IconButton size="small" onClick={() => updateSets(index, exercise.sets + 1)} sx={{ height: 24 }}>
                                                <KeyboardArrowUpIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                type="number"
                                                value={exercise.sets}
                                                onChange={(e) => updateSets(index, parseInt(e.target.value) || 0)}
                                                inputProps={{ min: 0, style: { textAlign: 'center', width: 50, height: 32, padding: 4 } }}
                                                size="small"
                                            />
                                            <IconButton size="small" onClick={() => updateSets(index, Math.max(0, exercise.sets - 1))} sx={{ height: 24 }}>
                                                <KeyboardArrowDownIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Grid>

                                {/* Cột 4: Các nút hành động */}
                                <Grid item xs={3}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            startIcon={<ShuffleIcon />}
                                            onClick={() => onShuffle(index, exercise)}
                                        >
                                            Trộn
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            startIcon={<AdsClickOutlinedIcon />}
                                            onClick={() => handlePick(index, exercise)}
                                        >
                                            Chọn
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={() => onRemove(index)}
                                            size="large"
                                            sx={{
                                                px: 1,
                                                py: 0.5,
                                                minWidth: 'auto',
                                                borderWidth: '0.5px',
                                                color: '#f55a4e',
                                                borderColor: '#f44336',

                                                '&:hover': {
                                                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                                    borderColor: '#f44336'
                                                }
                                            }}
                                        >
                                            <DeleteForeverOutlinedIcon sx={{ fontSize: 36 }} />
                                        </Button>

                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}

                <Box mt={2}>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        Thêm
                    </Button>

                </Box>
                <AddExerciseModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onPick={(newExercise) => setExercises([...exercises, newExercise])}
                    excludeExerciseIds={exercises.map(e => e.exerciseId)}
                    requiresEquipment={requiresEquipment}
                />
            </Box>
            <Box display='flex' justifyContent='center'>
                <Button
                    variant="contained"
                    onClick={handleSaveExercises}
                    sx={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        }
                    }}
                >
                    Tập luyện
                </Button>
            </Box>

            <Dialog open={openPickDialog} onClose={() => setOpenPickDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Chọn bài tập khác</DialogTitle>
                <DialogContent dividers>
                    {pickOptions.length === 0 ? (
                        <Typography>Không tìm thấy bài tập phù hợp.</Typography>
                    ) : (
                        pickOptions.map((ex, idx) => (
                            <Box key={idx} p={1} display="flex" justifyContent="space-between" alignItems="center" borderBottom="1px solid #eee">
                                <Box display='flex'>
                                    <Typography fontWeight={600}>{ex.name}</Typography>
                                    {ex.videoUrl && (() => {

                                        const videoUrl = ex.videoUrl.startsWith("http")
                                            ? ex.videoUrl
                                            : `https://localhost:5000${ex.videoUrl.startsWith("/") ? "" : "/"}${ex.videoUrl}`;


                                        return (
                                            <>
                                                <Tooltip title="Xem video">
                                                    <IconButton
                                                        onClick={() => setOpenVideo(videoUrl)}
                                                        sx={{ ml: 1, p: 0.5 }}
                                                        size="small"
                                                    >
                                                        <PlayCircleOutlineIcon color="primary" fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Dialog
                                                    open={openVideo === videoUrl}
                                                    onClose={() => setOpenVideo(null)}
                                                    maxWidth="md"
                                                    fullWidth
                                                >
                                                    <DialogTitle>Video hướng dẫn</DialogTitle>
                                                    <DialogContent>
                                                        <Box
                                                            component="iframe"
                                                            width="100%"
                                                            height="400px"
                                                            src={
                                                                /youtube\\.com|youtu\\.be/.test(videoUrl) && videoUrl.includes("watch?v=")
                                                                    ? videoUrl.replace("watch?v=", "embed/")
                                                                    : videoUrl
                                                            }
                                                            title="Exercise video"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => setOpenVideo(null)}>Đóng</Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </>
                                        );
                                    })()}
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => applyPickedExercise(ex)}
                                >
                                    Chọn bài này
                                </Button>
                            </Box>
                        ))
                    )}
                </DialogContent>
            </Dialog>

        </>
    );

}
export default SuggestedExerciseList;
