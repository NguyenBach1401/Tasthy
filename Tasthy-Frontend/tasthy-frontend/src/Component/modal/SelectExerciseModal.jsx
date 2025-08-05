import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, Stack } from '@mui/material';
import { createUserExercise } from '../../Services/AppServices/ExerciseService';
import { toast } from 'react-toastify';


const SelectExerciseModal = ({ open, onClose, exerciseId }) => {
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');

    const handleSubmit = async () => {
        if (!reps || !sets) {
            toast.warning('Vui lòng nhập đầy đủ số lần và số hiệp!');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Không tìm thấy token!');
            return;
        }

        try {
            await createUserExercise(token, { reps, sets, exerciseId });
            toast.success('Thêm bài tập thành công!');
            onClose();
        } catch (error) {
            toast.error('Thêm bài tập thất bại!');
            console.error(error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }
                }
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                minWidth: 300
            }}>

                <Typography variant="h6" mb={2}>
                    Nhập số lần (reps) và số hiệp (sets)
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Số lần (reps)"
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Số hiệp (sets)"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Xác nhận
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default SelectExerciseModal;
