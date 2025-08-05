import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { updateTag } from '../../../Services/AdminServices/AdminTagService';

const EditTagModal = ({ open, onClose, tag, onTagUpdated }) => {
    const [tagName, setTagName] = useState('');

    useEffect(() => {
        if (tag) {
            setTagName(tag.tagName);
        } else {
            setTagName('');
        }
    }, [tag]);

    const handleSubmit = async () => {

        try {
            await updateTag(tag.tagID, tagName);
            onTagUpdated();
            onClose();
        } catch (error) {
            console.error('Update tag failed', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>Sửa thẻ</Typography>
                <TextField
                    label="Tên thẻ"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                    Lưu thay đổi
                </Button>
            </Box>
        </Modal>
    );
};

export default EditTagModal;
