import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeByID } from '../../Services/AppServices/RecipeService';
import {
    Box, Typography, Chip, Grid, Button, Divider,
    CircularProgress, IconButton, Avatar, Stack
} from '@mui/material';
import { addFavor, removeFavor } from '../../Services/AppServices/FavoriteService';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from 'react-toastify';
import CommentsSection from '../../Component/comment'
import SelectMealModal from '../../Component/modal/SelecedMealModal';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SuggestedRecipes from './Recipe/SuggestRecipe';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavor, setIsFavor] = useState(false);
    const userId = localStorage.getItem('userId');
    const [openModal, setOpenModal] = useState(false);


    const navigate = useNavigate();
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeByID(id, userId);
                setRecipe(data);
                setIsFavor(data ? data.isFavor : false);
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleTagClick = (tag) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        navigate(`/tag/${tagName}`);
    };
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };
    const handleSuccess = () => {
        toast.success('Đã chọn món thành công');
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (!recipe) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Không tìm thấy công thức.</Typography>;
    const handleToggleFavor = async () => {
        try {
            if (isFavor) {

                await removeFavor(userId, recipe.recipeID);
                setIsFavor(false);
                toast.info('Đã xóa khỏi danh sách yêu thích.');
            } else {
                await addFavor(userId, recipe.recipeID);
                setIsFavor(true);
                toast.success('Đã thêm vào danh sách yêu thích!');
            }
        } catch (error) {
            toast.error('Lỗi khi xử lý yêu thích!');
            console.error('Lỗi khi xử lý yêu thích:', error);
        }
    };

    return (
        <Box sx={{ px: { xs: 2, md: 6, lg: 30 }, py: 15 }}>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, p: 1, backgroundColor: '#fff0f0', borderRadius: 2 }}>
                {recipe.tags.map((tag, idx) => (
                    <Chip
                        key={idx}
                        label={typeof tag === 'string' ? tag : tag.name}
                        color="error"
                        variant="outlined"
                        onClick={() => handleTagClick(tag)}
                    />
                ))}
            </Box>


            <Typography variant="h3" fontWeight="bold" gutterBottom>
                {recipe.title}
                <IconButton onClick={handleToggleFavor} color="error" sx={{ '& svg': { fontSize: 40 } }} >
                    {isFavor ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Typography>


            <Typography variant="body1" fontSize="1.2rem" sx={{ mb: 3 }}>
                {recipe.description}
            </Typography>


            <Box sx={{ border: '1px solid #f5c6cb', borderRadius: 2, p: 2, mb: 4, backgroundColor: '#fff5f5' }}>
                <Grid container spacing={2} justifyContent="space-around">
                    <Grid item>
                        <Stack direction="column" alignItems="center">
                            <GroupIcon color="error" sx={{ fontSize: 32 }} />
                            <Typography fontSize='1.2rem' variant="body2">Khẩu Phần:</Typography>
                            <Typography fontSize='1.2rem' fontWeight="bold">{recipe.servings} người</Typography>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="column" alignItems="center">
                            <AccessTimeIcon color="error" sx={{ fontSize: 32 }} />
                            <Typography fontSize='1.2rem' variant="body2">Thời gian nấu:</Typography>
                            <Typography fontSize='1.2rem' fontWeight="bold">{recipe.cookingTime} phút</Typography>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="column" alignItems="center">
                            <RestaurantMenuIcon color="error" sx={{ fontSize: 32 }} />
                            <Typography fontSize='1.2rem' variant="body2">Người đăng:</Typography>
                            <Typography fontSize='1.2rem' fontWeight="bold">{recipe.userName}</Typography>
                            <Typography fontSize='1.2rem' variant="caption">{formatDate(recipe.createdAt)}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ mb: 4 }} />



            <Grid container spacing={4} alignItems="flex-start">

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        maxWidth: { md: '330px' },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        p: 3, borderRadius: 3, boxShadow: 2,
                        backgroundColor: 'white'
                    }}>
                        <Typography variant="h6" fontWeight="bold">Nguyên liệu</Typography>
                        <Typography whiteSpace="pre-line" fontSize="1.2rem" mt={1}>{recipe.ingredients}</Typography>

                        <Box mt={3}>
                            <Typography variant="h6" fontWeight="bold">Giá trị dinh dưỡng</Typography>
                            {recipe.nutrition ? (
                                <>
                                    <Typography fontSize='1.2rem'>Calories: {recipe.nutrition.calories}</Typography>
                                    <Typography fontSize='1.2rem'>Carbs: {recipe.nutrition.carbs}g</Typography>
                                    <Typography fontSize='1.2rem'>Fat: {recipe.nutrition.fat}g</Typography>
                                    <Typography fontSize='1.2rem'>Protein: {recipe.nutrition.protein}g</Typography>

                                    <Button fullWidth variant="contained" color="error" sx={{ mt: 3 }} onClick={() => setOpenModal(true)}>
                                        Chọn món
                                    </Button>
                                </>
                            ) : (
                                <Typography fontStyle="italic" color="text.secondary">Không có thông tin dinh dưỡng.</Typography>
                            )}
                        </Box>


                        <SelectMealModal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            recipeId={recipe.recipeID}
                            recipeTitle={recipe.title}
                            onSuccess={handleSuccess}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            maxWidth: { md: '620px' },
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            p: 3, borderRadius: 3, boxShadow: 2, backgroundColor: 'white'
                        }}
                    >
                        <Typography variant="h6" fontSize="1.2rem" fontWeight="bold">
                            Cách chế biến
                        </Typography>
                        {recipe.instructions.split('\n').map((step, idx) => (
                            <Typography
                                key={idx}
                                fontSize="1.2rem"
                                sx={{
                                    mb: 1,
                                    whiteSpace: 'pre-line',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                }}
                            >
                                <strong>{idx + 1}.</strong> {step}
                            </Typography>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box>
                        <img
                            src={recipe.recipeIMG}
                            alt="Ảnh món ăn"
                            style={{
                                width: 500,
                                borderRadius: 12,
                                objectFit: 'cover',
                                maxHeight: 420,
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <CommentsSection
                recipe={recipe}
                userId={userId}
                userName={localStorage.getItem('userName')}
                isAuthenticated={!!localStorage.getItem('token')}
            />
            <SuggestedRecipes recipe={recipe} />


        </Box>

    );
};


export default RecipeDetail;
