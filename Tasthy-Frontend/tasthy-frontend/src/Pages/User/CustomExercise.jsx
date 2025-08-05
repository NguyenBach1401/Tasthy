import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import { createCustomExercise } from '../../Services/AppServices/ExerciseService';

const CustomExerciseModal = ({ open, onClose, onSuccess }) => {
    const [exercise, setExercise] = useState({
        exerciseName: '',
        caloriesPerRep: '',
        reps: '',
        sets: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async () => {
        try {
            const newExercise = {
                exerciseName: exercise.exerciseName,
                caloriesPerRep: parseFloat(exercise.caloriesPerRep),
                reps: parseInt(exercise.reps),
                sets: parseInt(exercise.sets)
            };

            await createCustomExercise(newExercise);
            toast.success('Thêm bài tập thành công');
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Lỗi khi thêm bài tập:', err);
            toast.error('Thêm bài tập thất bại');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm bài tập mới</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Tên bài tập"
                        name="exerciseName"
                        value={exercise.exerciseName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Calories mỗi rep"
                        name="caloriesPerRep"
                        type="number"
                        value={exercise.caloriesPerRep}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Số rep"
                        name="reps"
                        type="number"
                        value={exercise.reps}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Số set"
                        name="sets"
                        type="number"
                        value={exercise.sets}
                        onChange={handleChange}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleAdd}>Thêm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomExerciseModal;
