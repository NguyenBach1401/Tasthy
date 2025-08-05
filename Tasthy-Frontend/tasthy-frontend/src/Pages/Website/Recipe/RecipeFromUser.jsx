import React, { useRef } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const UserRecipeSwiper = ({ userRecipes, navigate }) => {
    const swiperRef = useRef();

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Custom Navigation Buttons */}
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
                    backgroundColor: 'variant',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#cc0000',
                    },
                }}
            >
                ◀
            </Button>

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
                    backgroundColor: 'variant',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#cc0000',
                    },
                }}
            >
                ▶
            </Button>

            <Swiper
                spaceBetween={20}
                slidesPerView={5}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation]}
                breakpoints={{
                    0: { slidesPerView: 1.2, spaceBetween: 12 },
                    600: { slidesPerView: 2, spaceBetween: 16 },
                    960: { slidesPerView: 3, spaceBetween: 20 },
                    1280: { slidesPerView: 5, spaceBetween: 20 },
                }}
            >
                {userRecipes.map((r, idx) => (
                    <SwiperSlide key={idx} style={{ overflow: 'visible' }}>
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
                            <Box
                                position="relative"
                                onClick={() => navigate(`/recipe/${r.recipeID}`)}
                            >
                                <CardMedia
                                    component="img"
                                    image={r.recipeIMG}
                                    alt={r.title}
                                    height="200"
                                    sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                                />

                                {/* Thẻ "Từ cộng đồng" luôn hiển thị */}
                                <Box
                                    position="absolute"
                                    top={8}
                                    left={8}
                                    bgcolor="rgba(255,255,255,0.9)"
                                    borderRadius={2}
                                    px={1}
                                    py={0.2}
                                >
                                    <Typography fontSize={12} fontWeight="bold" color="primary">
                                        Từ cộng đồng
                                    </Typography>
                                </Box>
                            </Box>
                            <CardContent>
                                <Typography
                                    fontWeight="bold"
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
    );
};

export default UserRecipeSwiper;
