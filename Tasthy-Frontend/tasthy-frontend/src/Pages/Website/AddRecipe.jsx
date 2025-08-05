import {
    Box, Button, TextField, Typography, Autocomplete, Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { getTag } from '../../Services/AppServices/TagService';
import { addRecipe } from '../../Services/AdminServices/AdminRecipeService';
import { toast } from 'react-toastify';

export default function AddRecipeForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [servings, setServings] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getTag(inputValue);
            setTagOptions(tags);
        };


        const delayDebounceFn = setTimeout(() => {
            fetchTags();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    const handleSubmit = async () => {
        if (!title || !servings || !ingredients || !instructions || !image) {
            toast.error('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('servings', servings);
        formData.append('cookingTime', cookingTime);

        formData.append('ingredients', ingredients);
        formData.append('instructions', instructions);
        formData.append('UserID', localStorage.getItem("userId"));
        if (image) formData.append('ImageFile', image);
        selectedTags.forEach(tag => {
            formData.append('Tags', tag.tagName);
        });

        try {
            await addRecipe(formData);
            toast.success('Tạo công thức thành công!');
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi gửi công thức.');
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Box maxWidth={600} mx="auto" p={3}>
            <Typography variant="h5" fontWeight="bold" mb={3}>Chi tiết về công thức món ăn</Typography>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Tên món ăn<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                label="Tên món ăn *"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Mô tả<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                label="Mô tả*"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Khẩu phần<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                label="Khẩu phần *"
                fullWidth
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                margin="normal"
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Thời gian nấu<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                label="Thời gian nấu *"
                fullWidth
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                margin="normal"
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Nguyên liệu<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                placeholder={`425g cá ngừ,\n35g vụn bánh panko`}
                fullWidth
                multiline
                rows={4}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                helperText="Vui lòng đặt nguyên liệu và định lượng ở những dòng khác nhau"
                margin="normal"
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        color: '#555',
                        opacity: 1,
                        fontSize: '1rem',
                    },
                }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Cách chế biến<span style={{ color: "red", fontWeight: 600 }}>*</span>
            </Typography>
            <TextField
                placeholder={`Sả băm nhuyễn phần củ, phần gần lá thì đập dập để riêng.\nCà rốt và củ cải gọt vỏ, rửa sạch, cắt khúc vừa ăn.`}
                fullWidth
                multiline
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                helperText="Vui lòng viết mỗi bước ở những dòng khác nhau"
                margin="normal"
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        color: '#555',
                        opacity: 1,
                        fontSize: '1rem',
                    },
                }}
            />

            <Autocomplete
                multiple
                options={tagOptions}
                getOptionLabel={(option) => option?.tagName || ''}
                value={selectedTags}
                onChange={(e, newValue) => setSelectedTags(newValue)}

                renderInput={(params) => (
                    <TextField {...params} label="Chọn thẻ (tuỳ chọn)" placeholder="Tìm kiếm theo từ khoá (ví dụ: món...)" margin="normal" />
                )}
                margin="normal"
            />

            <Box mt={2}>
                <Typography mb={1}>Đăng tải hình ảnh món ăn *</Typography>
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
                        onChange={handleImageChange}
                    />
                </Button>
                <Typography fontSize="0.85rem" color="text.secondary">
                    PNG or JPEG, max 10MB
                </Typography>

                {imagePreview && (
                    <Box mt={2}>
                        <Typography fontSize="0.85rem" color="text.secondary">Ảnh đã chọn:</Typography>
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                                mt: 1,
                                width: '100%',
                                maxWidth: 300,
                                borderRadius: 2,
                                border: '1px solid #ccc'
                            }}
                        />
                    </Box>
                )}
            </Box>
            <Button
                variant="contained"
                color="error"
                onClick={handleSubmit}
                sx={{ mt: 3 }}
            >
                Chia sẻ công thức
            </Button>
        </Box>
    );
}
