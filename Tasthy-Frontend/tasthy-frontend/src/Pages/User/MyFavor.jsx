

import {
    Box, Typography, Grid, Card, CardMedia, CardContent, Button,
    Stack, Pagination, Alert, CircularProgress
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserFavorites } from '../../Services/AppServices/FavoriteService';

function FavoriteList({ token }) {
    const [favorites, setFavorites] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 9;

    useEffect(() => {
        if (!token) return;

        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getUserFavorites(token, page, pageSize);
                setFavorites(data.recipeFavors);
                setTotalRecipes(data.totalRecipes);
            } catch (err) {
                setError('Không tải được danh sách yêu thích');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (!token) return <Alert severity="info">Bạn cần đăng nhập để xem danh sách yêu thích.</Alert>;
    if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (favorites.length === 0) return <Alert severity="warning">Danh sách yêu thích trống.</Alert>;

    const totalPages = Math.ceil(totalRecipes / pageSize);

    return (

        <Box sx={{ px: { xs: 2, md: 6, lg: 20 }, py: 6, mx: 'auto', mb: 4 }}>


            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#111',
                    color: '#fff',
                    borderRadius: 2,
                    p: 3,
                    mb: 4,
                }}
            >
                <Box sx={{ width: '80%' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                        Tất cả <br /> Món yêu thích
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, color: '#ccc' }}>
                        {totalRecipes} món ăn
                    </Typography>
                </Box>


                <Box sx={{ display: 'flex', gap: 2 }}>
                    {favorites.slice(-2).map((item, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={item.recipeIMG}
                            alt={item.title}
                            sx={{
                                width: 200,
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 2,
                            }}
                        />
                    ))}
                </Box>
            </Box>


            <Typography variant="h5" gutterBottom>
                Danh sách món yêu thích
            </Typography>
            <Grid container spacing={3}>
                {favorites.map((r) => (
                    <Grid
                        item
                        xs={6}
                        sm={6}
                        md={4}
                        lg={3}
                        key={r.recipeID}
                    >
                        <Card
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: 3,
                                border: '2px solid rgb(119, 235, 248)',
                                backgroundColor: '#fffdfd',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={r.recipeIMG}
                                alt={r.title}
                                sx={{
                                    width: { sx: 200, sm: 300, md: 400 },
                                    maxWidth: '100%',
                                    height: { xs: 140, sm: 180, md: 220 },
                                    objectFit: 'cover',
                                    margin: '0 auto',
                                }}
                            />
                            <CardContent>
                                <Typography fontWeight="bold" noWrap mb={1} fontSize={25}>
                                    {r.title}
                                </Typography>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    fontSize={20}
                                >
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                        <GroupIcon fontSize="small" />
                                        <span>Khẩu phần {r.servings} người</span>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                                        <AccessTimeIcon fontSize="small" />
                                        <span>{r.cookingTime} phút</span>
                                    </Box>
                                </Stack>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Stack spacing={2} mt={6} alignItems="center">
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Stack>

        </Box >

    );
}

export default FavoriteList;
