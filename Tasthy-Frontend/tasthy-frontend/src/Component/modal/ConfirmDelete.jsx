import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmDelete = ({ open, onClose, onConfirm, message = "Bạn có chắc chắn muốn xóa?" }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 350,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    textAlign: 'center'
                }}
            >
                <Typography variant="h6" mb={2}>
                    {message}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="outlined" onClick={onClose}>Hủy</Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>Xóa</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmDelete;
