import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Card,
    CardContent,
} from '@mui/material';
import { suggestByIngredients } from '../../../Services/AppServices/RecipeService';
import SuggestByIngredientModal from './SuggestByIngredientModal';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const SuggestByIngredients = () => {
    const [open, setOpen] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    const handleSuggest = async () => {
        const ingredients = input
            .split(',')
            .map((i) => i.trim().toLowerCase())
            .filter((i) => i !== '');

        if (!ingredients || ingredients.length === 0) return;

        try {
            setLoading(true);
            const data = await suggestByIngredients(ingredients);
            setRecipes(data);
            setOpen(true);
        } catch (error) {
            console.error('Lỗi gợi ý món ăn theo nguyên liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setInput(''); // ✅ reset input khi modal đóng
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 0 },
        }}>
            {/* Viền ngoài đẹp mắt */}
            <Card
                sx={{
                    maxWidth: { xs: 360, sm: 500, md: 700, lg: 900 },
                    px: { xs: 2, md: 3 },
                    py: { xs: 2, md: 3 },
                    borderRadius: 3,
                    border: '2px solid rgb(188, 242, 247)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.06)',
                    backgroundColor: '#fffdfd',
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        <span style={{ color: '#7ce0f6' }}>Vô vàn</span> công thức món ngon và dễ làm
                    </Typography>

                    <Paper
                        elevation={1}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            gap: 1,
                            width: '100%',
                            maxWidth: { xs: '100%', sm: 450, md: 600 },
                            mx: 'auto',
                            borderRadius: 3,
                            px: 2,
                            py: { xs: 0.5, md: 1 },
                            border: '1px solid rgb(197, 255, 252)',
                            backgroundColor: '#fffafa',
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />

                        <TextField
                            placeholder="Nhập nguyên liệu món ăn (cách nhau bởi dấu phẩy)"
                            variant="standard"
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                        />

                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleSuggest}
                            sx={{
                                flexShrink: 0,
                                minWidth: { xs: '100%', sm: 40 },
                                mt: { xs: 1, sm: 0 },
                                px: { xs: 1, sm: 2 },
                                borderRadius: 2,
                            }}
                        >
                            <ArrowForwardIcon />
                        </Button>
                    </Paper>
                </CardContent>
            </Card>

            {/* Modal hiển thị kết quả gợi ý */}
            <SuggestByIngredientModal
                open={open}
                onClose={handleClose}
                onSuggest={handleSuggest}
                recipes={recipes}
                loading={loading}
                input={input}
                setInput={setInput}
            />
        </Box>
    );
};

export default SuggestByIngredients;
