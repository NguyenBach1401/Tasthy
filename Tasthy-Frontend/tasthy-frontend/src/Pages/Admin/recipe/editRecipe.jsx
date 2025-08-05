import React, { useEffect, useState } from 'react';
import {
    Modal, Box, Typography, TextField, Button, Grid, MenuItem, Autocomplete, Chip
} from '@mui/material';
import { updateRecipe } from '../../../Services/AdminServices/AdminRecipeService';
import { getTag } from '../../../Services/AppServices/TagService';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', maxHeight: '90vh', overflowY: 'auto',
    bgcolor: 'background.paper', borderRadius: 4,
    boxShadow: 24, p: 4,
};

const EditRecipeModal = ({ open, onClose, recipe, onUpdate }) => {
    const [allTags, setAllTags] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        servings: 1,
        cookingTime: 0,
        ingredients: '',
        instructions: '',
        recipeIMG: '',
        tagNames: [],
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
    });
    const [inputValue, setInputValue] = useState('');
    const [tagOptions, setTagOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImageURL, setPreviewImageURL] = useState('');

    useEffect(() => {
        if (recipe) {
            setFormData({
                title: recipe.title,
                description: recipe.description,
                servings: recipe.servings,
                cookingTime: recipe.cookingTime,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                recipeIMG: recipe.recipeIMG,
                tagNames: recipe.tags?.map(t =>
                    typeof t === 'string' ? { tagName: t } : t
                ) || [],
                calories: recipe.nutrition?.calories?.toString() || '',
                protein: recipe.nutrition?.protein?.toString() || '',
                carbs: recipe.nutrition?.carbs?.toString() || '',
                fat: recipe.nutrition?.fat?.toString() || ''
            });
        }
    }, [recipe]);

    useEffect(() => {
        setLoading(true);
        getTag(inputValue)
            .then((res) => {
                setTagOptions(res);
                setLoading(false);
            })
            .catch(() => {
                setTagOptions([]);
                setLoading(false);
            });
    }, [inputValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (["calories", "protein", "carbs", "fat"].includes(name)) {
            const normalized = value.replace(',', '.');
            if (normalized === '' || /^(\d+(\.\d*)?|\.\d+)$/.test(normalized)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: normalized
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };




    const handleTagChange = (event) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => ({
            ...prev,
            tagNames: typeof value === 'string' ? value.split(',') : value,
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('Title', formData.title);
            formDataToSend.append('Description', formData.description || '');
            formDataToSend.append('Servings', formData.servings?.toString() || '0');
            formDataToSend.append('CookingTime', formData.cookingTime?.toString() || '0');
            formDataToSend.append('Ingredients', formData.ingredients || '');
            formDataToSend.append('Instructions', formData.instructions || '');

            const tagNamesToSend = formData.tagNames.map(t =>
                typeof t === 'string' ? t : t.tagName
            );
            tagNamesToSend.forEach((tag, index) => {
                formDataToSend.append(`TagNames[${index}]`, tag);
            });

            const parseToFloat = (val) => {
                if (!val) return 0;
                const str = val.toString().trim().replace(',', '.');
                const num = parseFloat(str);
                return isNaN(num) ? 0 : num;

            };



            formDataToSend.append('Calories', parseToFloat(formData.calories).toString());
            formDataToSend.append('Protein', parseToFloat(formData.protein).toString());
            formDataToSend.append('Carbs', parseToFloat(formData.carbs).toString());
            formDataToSend.append('Fat', parseToFloat(formData.fat).toString());



            if (newImageFile) {
                formDataToSend.append('imageFile', newImageFile);
            }

            await updateRecipe(recipe.recipeID, formDataToSend);
            toast.success('Cập nhật công thức thành công!');
            if (typeof onUpdate === 'function') {
                await onUpdate();
            }
            onClose();
        } catch (error) {
            toast.error('Cập nhật thất bại!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!open) {
            setNewImageFile(null);
            setPreviewImageURL(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return '';
            });
        }
    }, [open]);


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...style, width: '120vw', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                    Chỉnh sửa công thức
                </Typography>

                <Grid container spacing={2} sx={{ flexDirection: 'column' }}>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Tên món ăn *"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mô tả *"
                            multiline
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Khẩu phần *"
                            name="servings"
                            type="number"
                            value={formData.servings}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nguyên liệu *"
                            multiline
                            rows={4}
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Cách chế biến *"
                            multiline
                            rows={4}
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Thời gian nấu (phút) *"
                            name="cookingTime"
                            type="number"
                            value={formData.cookingTime}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={tagOptions}
                            getOptionLabel={(option) => option.tagName}
                            isOptionEqualToValue={(option, value) => option.tagID === value.tagID || option.tagName === value.tagName}
                            value={formData.tagNames}
                            onChange={(e, newValue) => setFormData(prev => ({ ...prev, tagNames: newValue }))}
                            onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip label={option.tagName} {...getTagProps({ index })} key={index} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Thẻ (tuỳ chọn)" margin="normal" />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Thành phần dinh dưỡng (tuỳ chọn)
                        </Typography>
                    </Grid>

                    {['calories', 'protein', 'carbs', 'fat'].map(field => (
                        <Grid item xs={12} key={field}>
                            <TextField
                                fullWidth
                                type="text"
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={field}
                                value={formData?.[field] ?? ''}
                                onChange={handleChange}
                            />
                        </Grid>
                    ))}

                    {(previewImageURL || formData.recipeIMG) && (
                        <Grid item xs={12}>
                            <img
                                src={previewImageURL || formData.recipeIMG}
                                alt="Ảnh món ăn"
                                style={{
                                    width: '100%',
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    border: '1px solid #ccc'
                                }}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            Tải ảnh mới
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // Xoá URL cũ nếu có để tránh rò rỉ bộ nhớ
                                        if (previewImageURL) {
                                            URL.revokeObjectURL(previewImageURL);
                                        }

                                        const url = URL.createObjectURL(file);
                                        setNewImageFile(file);
                                        setPreviewImageURL(url);
                                    }
                                }}
                            />
                        </Button>
                    </Grid>
                </Grid>
                {/* Nút hành động */}
                <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Lưu thay đổi
                    </Button>
                </Box>
            </Box>
        </Modal>




    );
};

export default EditRecipeModal;
