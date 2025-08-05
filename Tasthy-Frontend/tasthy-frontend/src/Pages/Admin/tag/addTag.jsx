import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, CircularProgress, Alert
} from '@mui/material';
import { createNewTag } from '../../../Services/AdminServices/AdminTagService';

const AddTagModal = ({ open, onClose, onTagCreated }) => {
    const [tagName, setTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!tagName.trim()) {
            setError('Tên tag không được để trống');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const newTag = await createNewTag(tagName);
            onTagCreated(newTag);
            setTagName('');
            onClose();
        } catch (err) {
            setError('Lỗi khi tạo tag. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTagName('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Thêm Tag Mới</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    label="Tên tag"
                    fullWidth
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Hủy</Button>
                <Button onClick={handleCreate} disabled={loading} variant="contained">
                    {loading ? <CircularProgress size={24} /> : 'Tạo'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTagModal;
