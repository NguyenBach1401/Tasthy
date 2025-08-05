import { Box, Typography, Grid, Button, Card, CardContent, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const healthData = [
    {
        label: 'Bổ máu',
        tag: 'bổ máu',
        icon: '/img/blood.png',
    },
    {
        label: 'Hỗ trợ thận',
        tag: 'giảm mỡ',
        icon: '/img/human.png',
    },
    {
        label: 'Hỗ trợ gan',
        tag: 'hỗ trợ gan',
        icon: '/img/detox.png',
    },
    {
        label: 'Tốt cho xương',
        tag: 'tốt cho xương',
        icon: '/img/healthy.png',
    },
    {
        label: 'Giúp làm việc hiệu quả',
        tag: 'làm việc hiệu quả',
        icon: 'img/proactive.png',
    }
];

const HealthMenu = () => {
    const [healthRecipes, setHealthRecipes] = useState({});
    const navigate = useNavigate();

    // useEffect(() => {
    //     getHealthRecipe().then((res) => {
    //         setHealthRecipes(res);
    //     });
    // }, []);
    const handleTagClick = (tagName) => {
        navigate(`/tag/${tagName}`);
    };

    return (
        <Box sx={{ py: 6 }}>
            {/* Tiêu đề */}
            <Typography variant="h2" fontWeight="bold" textAlign="center" mb={4}>
                Công thức <span style={{ color: '#7ce0f6' }}>Dinh Dưỡng</span>
            </Typography>

            {/* Grid health */}
            <Grid container spacing={4} justifyContent="center">
                {healthData.map((item, idx) => (
                    <Grid item key={idx}>
                        <Card
                            sx={{
                                width: 280,
                                height: 250,
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: '0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                '&:hover': {
                                    borderColor: '#7ce0f6',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 20px #7ce0f6',
                                }
                            }}
                            onClick={() => {
                                handleTagClick(item.label)
                            }}
                        >
                            <Avatar
                                src={item.icon}
                                alt={item.label}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    bgcolor: '#94e6f8',
                                    mb: 2,
                                }}
                            />
                            <Typography
                                fontWeight="bold"
                                fontSize="1rem"
                                sx={{ px: 1 }}
                            >
                                {item.label}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>




        </Box>
    );
};

export default HealthMenu;
