import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { selectedRecipe } from '../../Services/AppServices/RecipeService';

const SelectMealModal = ({ open, onClose, recipeId, recipeTitle, onSuccess }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const userId = parseInt(localStorage.getItem('userId'));
            console.log(recipeId)
            const result = await selectedRecipe(userId, recipeId, quantity);
            if (result === true) {
                onSuccess?.();
                onClose();
            } else {
                alert('Chọn món thất bại');
            }
        } catch (error) {
            alert('Lỗi khi chọn món');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chọn món: {recipeTitle}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Số lượng"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 1 }}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Hủy</Button>
                <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectMealModal;
