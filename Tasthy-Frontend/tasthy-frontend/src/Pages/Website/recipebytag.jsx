import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Pagination, Stack } from '@mui/material';
import { getRecipesByTag } from '../../Services/AppServices/RecipeService';
import { useParams, useNavigate } from 'react-router-dom';

function RecipeByTag() {
    const { tagName } = useParams();
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pageSize = 12;

    const fetchRecipes = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await getRecipesByTag(tagName, pageNumber, pageSize);
            setRecipes(res.recipes || []);
            const total = res.totalRecords || 0;
            setTotalPages(Math.ceil(total / pageSize));
        } catch (err) {
            setError('Lỗi khi tải công thức');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(page);
    }, [page, tagName]);

    if (loading) return <Typography>Đang tải công thức...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ px: { xs: 2, md: 6, lg: 30 }, py: 5 }}>
            <Grid container spacing={3} justifyContent="center">
                {recipes.map((recipe, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx} padding={1}>
                        <Box
                            onClick={() => navigate(`/recipe/${recipe.recipeID}`)}
                            sx={{
                                width: '100%',
                                height: 360,
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: 3,
                                backgroundColor: '#fff',
                                textAlign: 'center',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: '0.3s',
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            <img
                                src={recipe.recipeIMG}
                                alt={recipe.title}
                                style={{
                                    width: 350,
                                    height: 300,
                                    objectFit: 'cover',
                                    display: 'block',
                                    margin: '0 auto',
                                }}
                            />
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                fontSize={20}
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    px: 1,
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {recipe.title}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Stack spacing={2} alignItems="center" mt={5}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                />
            </Stack>
        </Box>
    );
}

export default RecipeByTag;
