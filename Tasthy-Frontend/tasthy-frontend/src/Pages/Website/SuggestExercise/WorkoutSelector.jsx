import React, { useState } from 'react';
import {
    Button, Grid, Typography, Box, Card, CardActionArea, CardMedia, CardContent
} from '@mui/material';

const equipmentOptions = [
    { label: 'Tập tại nhà', value: false, image: '/img/home.png' },
    { label: 'Phòng gym', value: true, image: '/img/gym.png' },
    { label: "Hỗn hợp", value: null, image: '/img/merge.png' }
];

const muscleGroups = [
    { label: 'Chân', value: 'legs', image: '/img/legs.png' },
    { label: 'Tay', value: 'arms', image: '/img/arms.png' },
    { label: 'Lưng', value: 'back', image: '/img/back.png' },
    { label: 'Bụng', value: 'core', image: '/img/abs.png' },
    { label: 'Vai', value: 'shoulder', image: '/img/shoulders.jpg' },
    { label: 'Ngực', value: 'chest', image: '/img/chest.png' },
];

const WorkoutSelector = ({ onContinue }) => {
    const [requiresEquipment, setRequiresEquipment] = useState(null);
    const [selectedMuscles, setSelectedMuscles] = useState([]);

    const toggleMuscle = (value) => {
        setSelectedMuscles(prev =>
            prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
        );
    };

    const handleContinue = () => {
        onContinue({ requiresEquipment, muscleGroups: selectedMuscles });
    };

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Chọn môi trường tập luyện
            </Typography>
            <Grid container spacing={2} mb={4}>
                {equipmentOptions.map((option) => (
                    <Grid item xs={6} key={option.value}>
                        <Card
                            onClick={() => setRequiresEquipment(option.value)}
                            sx={{ border: requiresEquipment === option.value ? '2px solid blue' : '1px solid #ccc' }}
                        >
                            <CardActionArea>
                                <CardMedia component="img" height="120" image={option.image} />
                                <CardContent>
                                    <Typography align="center">{option.label}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" gutterBottom>
                Chọn nhóm cơ bạn muốn tập
            </Typography>
            <Grid container spacing={2}>
                {muscleGroups.map((group) => (
                    <Grid item xs={6} sm={4} key={group.value}>
                        <Card
                            onClick={() => toggleMuscle(group.value)}
                            sx={{
                                border: selectedMuscles.includes(group.value)
                                    ? '2px solid green' : '1px solid #ccc'
                            }}
                        >
                            <CardActionArea>
                                <CardMedia component="img" height="100" image={group.image} />
                                <CardContent>
                                    <Typography align="center">{group.label}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4} textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleContinue}
                    disabled={selectedMuscles.length === 0}
                >
                    Tiếp tục
                </Button>
            </Box>
        </Box>
    );
};

export default WorkoutSelector;
