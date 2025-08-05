import React, { useEffect, useState, useRef } from 'react';
import { getSuggestRecipe } from '../../../Services/AppServices/RecipeService';
import { Box, Typography, Chip, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';


const SuggestedRecipes = ({ recipe }) => {
    const [recipes, setRecipes] = useState([]);
    const swiperRef = useRef();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!recipe?.recipeID) return;
            try {
                const data = await getSuggestRecipe(recipe.recipeID);
                setRecipes(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đề xuất:', error);
            }
        };

        fetchSuggestions();
    }, [recipe?.recipeID]);

    if (!recipes || recipes.length === 0) return null;

    return (
        <Box sx={{ mt: 6, position: 'relative' }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Gợi ý dành cho bạn
            </Typography>

            {/* Nút điều hướng trái */}
            <Button
                variant="contained"
                onClick={() => swiperRef.current?.slidePrev()}
                sx={{
                    position: 'absolute',
                    top: '45%',
                    left: -20,
                    zIndex: 10,
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e53935',
                    color: 'white',
                    fontSize: '1.2rem',
                    '&:hover': {
                        backgroundColor: '#cc0000',
                    },
                }}
            >
                ◀
            </Button>

            {/* Nút điều hướng phải */}
            <Button
                variant="contained"
                onClick={() => swiperRef.current?.slideNext()}
                sx={{
                    position: 'absolute',
                    top: '45%',
                    right: -20,
                    zIndex: 10,
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e53935',
                    color: 'white',
                    fontSize: '1.2rem',
                    '&:hover': {
                        backgroundColor: '#cc0000',
                    },
                }}
            >
                ▶
            </Button>

            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.2}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                    600: { slidesPerView: 2.2 },
                    960: { slidesPerView: 3.5 },
                    1280: { slidesPerView: 4.5 },
                }}
            >
                {recipes.map((item) => (
                    <SwiperSlide key={item.recipeID}>
                        <Box sx={{ position: 'relative', textDecoration: 'none', color: 'black' }} component={Link} to={`/recipe/${item.recipeID}`}>
                            {/* Ảnh nền + chip */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    height: 180,
                                    backgroundImage: `url(${item.recipeIMG})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}

                            >
                                <Chip
                                    label="Đề xuất"
                                    color="error"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        fontWeight: 'bold',
                                        backgroundColor: '#d32f2f',
                                        color: 'white',
                                        zIndex: 2,
                                    }}
                                />
                            </Box>

                            {/* Tiêu đề bên dưới ảnh */}
                            <Box sx={{ mt: 1.2, px: 0.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    sx={{ textAlign: 'center', fontSize: '1rem' }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default SuggestedRecipes;
