// CheatDayAddRecipe.jsx
import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import { createCheatMeal } from '../../Services/AppServices/RecipeService';

const CheatDayAddRecipe = ({ open, onClose, token, onSuccess }) => {
    const [recipe, setRecipe] = useState({
        name: '',
        calories: '',
        fat: '',
        carbs: '',
        protein: '',
        quantity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
    };
    const handleAdd = async () => {
        try {
            const mealData = {
                mealName: recipe.name,
                calories: parseFloat(recipe.calories),
                fat: parseFloat(recipe.fat),
                carbs: parseFloat(recipe.carbs),
                protein: parseFloat(recipe.protein),
                quantity: parseInt(recipe.quantity),
            };

            await createCheatMeal(token, mealData);
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Lỗi khi thêm Cheat Meal:', err);
            toast.error('Thêm món ăn thất bại');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm món ăn Cheat Meal</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField label="Tên món" name="name" value={recipe.name} onChange={handleChange} fullWidth />
                    <TextField label="Calories" name="calories" type="number" value={recipe.calories} onChange={handleChange} fullWidth />
                    <TextField label="Fat (g)" name="fat" type="number" value={recipe.fat} onChange={handleChange} fullWidth />
                    <TextField label="Carbs (g)" name="carbs" type="number" value={recipe.carbs} onChange={handleChange} fullWidth />
                    <TextField label="Protein (g)" name="protein" type="number" value={recipe.protein} onChange={handleChange} fullWidth />
                    <TextField label="Số lượng" name="quantity" type="number" value={recipe.quantity} onChange={handleChange} fullWidth />

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleAdd}>Thêm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CheatDayAddRecipe;
