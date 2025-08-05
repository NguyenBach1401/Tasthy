import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, Card, CardActionArea, CardMedia, CardContent,
    Typography, Button, Box
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { PickExercise } from '../../../Services/AppServices/ExerciseService';


const muscleGroups = [
    { label: 'Chân', value: 'legs', image: '/img/legs.png' },
    { label: 'Tay', value: 'arms', image: '/img/arms.png' },
    { label: 'Lưng', value: 'back', image: '/img/back.png' },
    { label: 'Bụng', value: 'core', image: '/img/abs.png' },
    { label: 'Vai', value: 'shoudler', image: '/img/shoulders.jpg' },
    { label: 'Ngực', value: 'chest', image: '/img/chest.png' },
];

const AddExerciseModal = ({ open, onClose, onPick, excludeExerciseIds = [], requiresEquipment = null }) => {
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [exercises, setExercises] = useState([]);

    const handlePickMuscle = async (muscleValue) => {
        setSelectedMuscle(muscleValue);
        try {
            const res = await PickExercise({
                muscleGroups: [muscleValue],
                excludeExerciseIds,
                requiresEquipment,
            });
            setExercises(res);
        } catch (err) {
            toast.error('Không thể tải bài tập.');
            setExercises([]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chọn nhóm cơ</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {muscleGroups.map((group) => (
                        <Grid item xs={6} sm={4} key={group.value}>
                            <Card
                                onClick={() => handlePickMuscle(group.value)}
                                sx={{
                                    border: selectedMuscle === group.value ? '2px solid green' : '1px solid #ccc',
                                    cursor: 'pointer'
                                }}
                            >
                                <CardActionArea>
                                    <CardMedia component="img" height="100" image={group.image} />
                                    <CardContent>
                                        <Typography align="center">{group.label}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {exercises.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="subtitle1">Chọn một bài tập:</Typography>
                        {exercises.map((ex) => (
                            <Box
                                key={ex.exerciseId}
                                border="1px solid #ccc"
                                p={2}
                                mt={1}
                                borderRadius={2}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography fontWeight="bold">{ex.name}</Typography>
                                    <Typography variant="body2">Nhóm cơ: {ex.recommendedFor}</Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        onPick(ex);
                                        onClose();
                                    }}
                                >
                                    Chọn bài này
                                </Button>
                            </Box>
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddExerciseModal;
