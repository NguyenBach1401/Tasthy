import React from 'react';
import { Modal, Box, TextField, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const SuggestByIngredientModal = ({ open, onClose, onSuggest, recipes, loading, input, setInput }) => {
    const handleSuggest = () => {
        const ingredients = input
            .split(',')
            .map((i) => i.trim().toLowerCase())
            .filter((i) => i !== '');

        onSuggest(ingredients);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Gợi ý món ăn theo nguyên liệu
                </Typography>

                <TextField
                    label="Nhập nguyên liệu (cách nhau bởi dấu phẩy)"
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button variant="contained" color="primary" onClick={handleSuggest}>
                    Gợi ý
                </Button>

                {loading && <Typography mt={2}>Đang tìm món ăn phù hợp...</Typography>}

                {recipes.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="subtitle1" mb={2}>
                            Kết quả gợi ý:
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 1,
                            }}
                        >
                            {recipes.map((r) => (
                                <Link
                                    to={`/recipe/${r.recipeID}`}
                                    key={r.recipeID}
                                    style={{ textDecoration: 'none', minWidth: 220, flexShrink: 0 }}
                                >
                                    <Box
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            overflow: 'hidden',
                                            backgroundColor: '#fff',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                            },
                                        }}
                                    >
                                        <img
                                            src={r.recipeIMG}
                                            alt={r.title}
                                            style={{ width: '100%', height: 140, objectFit: 'cover' }}
                                        />
                                        <Box p={2}>
                                            <Typography fontWeight="bold" color="text.primary">
                                                {r.title}
                                            </Typography>
                                            <Chip
                                                label="Từ nguyên liệu"
                                                size="small"
                                                color="success"
                                                sx={{ mt: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Link>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default SuggestByIngredientModal;
