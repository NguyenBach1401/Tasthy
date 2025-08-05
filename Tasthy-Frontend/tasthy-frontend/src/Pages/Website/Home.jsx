import React, { useEffect, useState } from 'react';
import {
    Grid, Typography, Chip,
    Box, Card, CardMedia, CardContent,
    Button, Icon
} from '@mui/material';
import { getAllRecipes } from '../../Services/AppServices/RecipeService';
import { useNavigate } from 'react-router-dom';
import { getPopularTags } from '../../Services/AppServices/TagService';
import { getTopFavorite } from '../../Services/AppServices/FavoriteService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HealthMenu from './Health/HealthMenu';
import { getRecipeFromUser } from '../../Services/AppServices/RecipeService';
import UserRecipeSwiper from './Recipe/RecipeFromUser';
import SuggestByIngredients from './Recipe/SuggestByIngredients';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { Link } from "react-router-dom";

function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorrecipes, setFavorRecipes] = useState([]);
    const [tags, setTags] = useState([]);
    const [userrecipes, setUserRecipes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getAllRecipes();
                setRecipes(data);
            } catch (err) {
                setError('Lỗi khi tải công thức');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    useEffect(() => {
        getTopFavorite().then(setFavorRecipes).catch(console.error);
        getPopularTags().then(setTags).catch(console.error);
        getRecipeFromUser().then(setUserRecipes).catch(console.error);
    }, []);


    const handleTagClick = (tagName) => {
        navigate(`/tag/${tagName}`);
    };


    if (loading) return <Typography>Đang tải công thức...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <>
            <Box my={4}>
                <SuggestByIngredients />
                {/* Tiêu đề tìm kiếm phổ biến */}
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    textAlign="center"
                    gutterBottom
                    fontSize="1.5rem"
                >
                    TÌM KIẾM PHỔ BIẾN
                </Typography>

                {/* Tag buttons */}
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mb={4}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag.tagID}
                            label={tag.tagName}
                            clickable
                            variant="outlined"
                            sx={{ fontSize: '1.5rem', paddingX: 1.5, paddingY: 0.5 }}
                            onClick={() => handleTagClick(tag.tagName)}
                        />
                    ))}
                </Box>

                {/* Title */}
                <Box sx={{ textAlign: 'center', mt: 5, mb: 3 }}>
                    {/* Dòng trái tim và gạch ngang */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                height: '2px',
                                width: 80,
                                backgroundColor: '#7ce0f6',
                                borderRadius: 2,
                            }}
                        />
                        <FavoriteBorderOutlinedIcon
                            sx={{ color: '#7ce0f6', fontSize: 60 }}
                        />
                        <Box
                            sx={{
                                height: '2px',
                                width: 80,
                                backgroundColor: '#7ce0f6',
                                borderRadius: 2,
                            }}
                        />
                    </Box>

                    {/* Tiêu đề chính */}
                    <Typography variant="h4" fontWeight="bold">
                        <span style={{ color: '#000' }}>Món Ngon </span>
                        <span style={{ color: '#7ce0f6' }}>Yêu thích</span>
                    </Typography>
                </Box>

                {/* Swiper carousel – thêm padding để cách đều 2 bên */}
                <Box sx={{ px: { xs: 2, md: 6, lg: 30 } }}>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={5}
                        navigation
                        modules={[Navigation]}
                        breakpoints={{
                            0: { slidesPerView: 1.2, spaceBetween: 12 },
                            600: { slidesPerView: 2, spaceBetween: 16 },
                            960: { slidesPerView: 3, spaceBetween: 20 },
                            1280: { slidesPerView: 5, spaceBetween: 20 },
                        }}
                    >
                        {favorrecipes.map((r, idx) => (
                            <SwiperSlide
                                key={idx}
                                style={{ overflow: 'visible' }}
                            >

                                <Card
                                    sx={{
                                        border: '1px solid #f5c7c7',
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        zIndex: 1,
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'scale(1.15)',
                                            boxShadow: 6,
                                            zIndex: 10,
                                        },
                                    }}
                                >
                                    <Box position="relative"
                                        onClick={() => navigate(`/recipe/${r.recipeID}`)}>
                                        <CardMedia
                                            component="img"
                                            image={r.recipeIMG}
                                            alt={r.title}
                                            height="200"
                                            sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                                        />
                                        <Box
                                            position="absolute"
                                            top={8}
                                            right={8}
                                            bgcolor="white"
                                            borderRadius={5}
                                            px={1}
                                            py={0.2}
                                            display="flex"
                                            alignItems="center"
                                        >
                                            <Typography fontSize={14} color="black" mr={0.5}>
                                                {r.favoriteCount}
                                            </Typography>
                                            <FavoriteIcon fontSize="small" htmlColor="red" />
                                        </Box>
                                    </Box>
                                    <CardContent>
                                        <Typography
                                            fontWeight='bold'
                                            fontSize={20}
                                            textAlign="center"
                                            noWrap
                                        >
                                            {r.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Box>


            <Box sx={{ px: { xs: 2, md: 6, lg: 30 }, py: 5 }}>
                <Box sx={{ textAlign: 'center' }}>
                    {/* Dòng trái tim và gạch ngang */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                        }}
                    >
                        <Box
                            sx={{
                                height: '2px',
                                width: 80,
                                backgroundColor: '#7ce0f6',
                                borderRadius: 2,
                            }}
                        />
                        <NewReleasesIcon
                            sx={{ color: '#7ce0f6', fontSize: 60 }}
                        />
                        <Box
                            sx={{
                                height: '2px',
                                width: 80,
                                backgroundColor: '#7ce0f6',
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                        <span style={{ color: '#000' }}>Món Ngon </span>
                        <span style={{ color: '#7ce0f6' }}>Mới Nhất</span>
                    </Typography>

                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        width: 'fit-content',
                        mb: 2,
                        px: 1,
                        cursor: 'pointer',
                        transition: 'color 0.3s ease',
                        '&:hover': {
                            color: '#7ce0f6',
                        },
                    }}
                >
                    <Typography
                        component={Link}
                        to="/search?scope=recipes&kw="
                        variant="subtitle1"
                        fontWeight="bold"
                        fontSize={20}
                        sx={{
                            textDecoration: "none",
                            color: "inherit",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" }
                        }}
                    >
                        Công thức mới nhất
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        fontSize={20}
                        sx={{ ml: 1 }}
                    >
                        <Icon><ArrowForwardIosIcon /></Icon>
                    </Typography>
                </Box>
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                >
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
                                    }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    fontSize={20}
                                    sx={{
                                        mt: 1, mb: 1, px: 1,
                                        whiteSpace: 'normal', wordWrap: 'break-word',
                                    }}

                                >
                                    {recipe.title}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <HealthMenu />
                <Box mt={4} display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="error"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            fontWeight: 'bold',
                            px: 4,
                            borderRadius: 3,
                            '&:hover': {
                                backgroundColor: '#f57c7c',
                            },
                        }}
                        onClick={() => navigate(`/health`)}
                    >
                        XEM THÊM
                    </Button>
                </Box>
                <Box sx={{ px: 1, py: 3 }}>
                    <Typography fontWeight="bold" fontSize="1.2rem">
                        Sở hữu công thức của riêng bạn? <a href="/newrecipe" style={{
                            color: 'red',
                            textDecoration: "none", fontWeight: 'bold'
                        }}>Chia sẻ tại đây</a>
                    </Typography>
                    <UserRecipeSwiper userRecipes={userrecipes} navigate={navigate} />
                </Box>

            </Box>
        </>
    );

}

export default RecipeList;
