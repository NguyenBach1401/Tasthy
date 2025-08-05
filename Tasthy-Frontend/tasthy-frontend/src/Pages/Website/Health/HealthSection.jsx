import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    Stack
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';


const capitalizeWords = (str) =>
    str
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

const HealthSection = ({ title, recipes }) => {
    if (!recipes || recipes.length === 0) return null;

    return (
        <>

            <Box my={6}>
                <Typography
                    variant="h2"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ mb: 3 }}
                    dangerouslySetInnerHTML={{
                        __html: capitalizeWords(title).replace(
                            /(Bổ Máu|Làm Việc Hiệu Quả|Tốt Cho Xương|Hỗ Trợ Gan|Hỗ Trợ Thận)/gi,
                            (match) => `<span style="color:rgb(119, 235, 248)">${match}</span>`
                        )
                    }}
                />

                <Box sx={{ px: { xs: 2, md: 6, lg: 30 } }}>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation
                        modules={[Navigation]}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 12 },
                            600: { slidesPerView: 2, spaceBetween: 16 },
                            960: { slidesPerView: 2, spaceBetween: 20 },
                            1280: { slidesPerView: 3, spaceBetween: 20 },
                        }}
                    >
                        {recipes.map((r) => (
                            <SwiperSlide key={r.recipeID}>
                                <Card sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                    border: '2px solid rgb(119, 235, 248)',
                                    backgroundColor: '#fffdfd',
                                }}>
                                    <CardMedia
                                        component="img"
                                        image={r.recipeIMG}
                                        alt={r.title}
                                        height="250"
                                        sx={{ objectFit: 'cover' }}
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
                                                <span>{r.servings} người</span>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AccessTimeIcon fontSize="small" />
                                                <span>{r.cookingTime} phút</span>
                                            </Box>
                                        </Stack>

                                        <Box mt={2} display="flex" justifyContent="flex-start">
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                component={Link}
                                                to={`/recipe/${r.recipeID}`}
                                                sx={{
                                                    bgcolor: '#f87171',
                                                    width: { xs: '100%', md: '40%' },
                                                    fontWeight: 'bold',
                                                    '&:hover': { bgcolor: '#ef4444' }
                                                }}
                                            >
                                                XEM CHI TIẾT
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Box>
        </>
    );
};

export default HealthSection;
