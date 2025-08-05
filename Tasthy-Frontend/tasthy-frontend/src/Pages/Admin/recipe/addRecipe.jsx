import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, Autocomplete, Box, FormHelperText
} from '@mui/material';
import { addRecipe } from '../../../Services/AdminServices/AdminRecipeService';
import { getTag } from '../../../Services/AppServices/TagService'

const AddRecipeModal = ({ open, onClose, onRecipeAdded }) => {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [directions, setDirections] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        servings: "",
        ingredients: "",
        cookingTime: "",
        directions: "",
        selectedTags: "",
        image: "",
    });
    const validate = () => {
        const isPositiveInt = (v) => /^\d+$/.test(v) && Number(v) > 0;

        const newErr = {
            title: !title.trim() ? "Tiêu đề không được để trống" : "",
            description: !description.trim() ? "Mô tả không được để trống" : "",
            servings: !isPositiveInt(servings) ? "Khẩu phần phải là số nguyên dương" : "",
            ingredients: !ingredients.trim()
                ? "Danh sách nguyên liệu không được để trống"
                : "",
            cookingTime: !isPositiveInt(cookingTime)
                ? "Thời gian nấu phải là số phút dương"
                : "",
            directions: !directions.trim()
                ? "Cách chế biến không được để trống"
                : "",
            selectedTags: selectedTags.length === 0 ? "Chọn ít nhất 1 thẻ" : "",
            image: !image ? "Vui lòng chọn ảnh món ăn" : "",
        };

        setErrors(newErr);
        return Object.values(newErr).every((v) => v === "");
    };

    useEffect(() => {
        const fetchAllTags = async () => {
            const tags = await getTag();
            setTagOptions(tags);
        };
        fetchAllTags();
    }, []);
    // Nutrition fields
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const handleSubmit = async () => {
        if (loading) return;
        if (!validate()) return;


        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('Title', title);
            formData.append('Description', description);
            formData.append('Servings', servings);
            formData.append('Ingredients', ingredients);
            formData.append('Instructions', directions);
            formData.append('UserID', localStorage.getItem("userId"));
            formData.append('CookingTime', cookingTime);
            if (image) formData.append('ImageFile', image);

            const tagNames = selectedTags.map(t => t.tagName);
            tagNames.forEach(tag => formData.append('Tags', tag));

            const nutrition = {
                Calories: calories,
                Protein: protein,
                Carbs: carbs,
                Fat: fat,
            };
            formData.append('Nutrition.Calories', nutrition.Calories);
            formData.append('Nutrition.Protein', nutrition.Protein);
            formData.append('Nutrition.Carbs', nutrition.Carbs);
            formData.append('Nutrition.Fat', nutrition.Fat);

            await addRecipe(formData);
            onRecipeAdded();
            onClose();
        } catch (error) {
            console.error('Lỗi khi thêm công thức:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Thêm công thức món ăn</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <TextField label="Tên món ăn *" fullWidth value={title}
                        onChange={(e) => setTitle(e.target.value)} margin="normal"
                        error={Boolean(errors.title)} helperText={errors.title} />
                    <TextField label="Mô tả *" multiline rows={3} fullWidth
                        value={description} onChange={(e) => setDescription(e.target.value)} margin="normal"
                        error={Boolean(errors.description)}
                        helperText={errors.description} />
                    <TextField label="Khẩu phần *" fullWidth type="number"
                        value={servings} onChange={(e) => setServings(e.target.value)} margin="normal"
                        error={Boolean(errors.servings)}
                        helperText={errors.servings} />
                    <TextField label="Nguyên liệu *" multiline rows={4} fullWidth
                        value={ingredients} onChange={(e) => setIngredients(e.target.value)} margin="normal"
                        error={Boolean(errors.ingredients)}
                        helperText={errors.ingredients} />
                    <TextField label="Cách chế biến *" multiline rows={4} fullWidth
                        value={directions} onChange={(e) => setDirections(e.target.value)} margin="normal"
                        error={Boolean(errors.directions)}
                        helperText={errors.directions} />
                    <TextField label="Thời gian nấu *" fullWidth type="number"
                        value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} margin="normal"
                        error={Boolean(errors.cookingTime)}
                        helperText={errors.cookingTime} />

                    <Autocomplete
                        multiple
                        options={tagOptions}
                        getOptionLabel={(option) => option?.tagName || ''}
                        value={selectedTags}
                        onChange={(e, newValue) => setSelectedTags(newValue)}
                        renderInput={(params) => <TextField {...params} label="Thẻ" margin="normal"
                            error={Boolean(errors.selectedTags)}
                            helperText={errors.selectedTags} />}
                    />

                    <Box mt={2}>
                        <Typography variant="subtitle1" fontWeight="bold">Thành phần dinh dưỡng</Typography>
                        <TextField label="Calories (kcal)" type="number" fullWidth
                            value={calories} onChange={(e) => setCalories(e.target.value)} margin="dense" />
                        <TextField label="Protein (g)" type="number" fullWidth
                            value={protein} onChange={(e) => setProtein(e.target.value)} margin="dense" />
                        <TextField label="Carbs (g)" type="number" fullWidth
                            value={carbs} onChange={(e) => setCarbs(e.target.value)} margin="dense" />
                        <TextField label="Fat (g)" type="number" fullWidth
                            value={fat} onChange={(e) => setFat(e.target.value)} margin="dense" />
                    </Box>

                    <Box mt={2}>
                        <Typography mb={1}>Hình ảnh *</Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ borderColor: 'red', color: 'red' }}
                        >
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImage(file);
                                    }
                                }}
                            />
                        </Button>
                        {errors.image && (
                            <FormHelperText error sx={{ mt: 0.5 }}>
                                {errors.image}
                            </FormHelperText>
                        )}

                        <Typography fontSize="0.85rem" color="text.secondary">
                            PNG or JPEG, max 10MB
                        </Typography>

                        {image && (
                            <Box mt={1}>
                                <Typography fontSize="0.9rem" fontWeight="bold">
                                    Đã chọn:
                                </Typography>
                                <Typography>{image.name}</Typography> {/* ✅ Tên file ảnh */}
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    sx={{ width: 200, mt: 1, borderRadius: 2 }}
                                /> {/* ✅ Hiển thị preview ảnh */}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Huỷ</Button>
                <Button onClick={handleSubmit} variant="contained" color="error">Thêm món ăn</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRecipeModal;
