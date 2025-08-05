import React from 'react';
import { Grid, Card, CardMedia, Typography, CardContent } from '@mui/material';

const exercises = [
    {
        exerciseId: 1,
        name: 'Spiderman Push Up',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 2,
        name: 'Jumping Jacks',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 3,
        name: 'Squats',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 4,
        name: 'Plank',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 5,
        name: 'Lunges',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 6,
        name: 'Burpees',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 5,
        name: 'Lunges',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
    {
        exerciseId: 6,
        name: 'Burpees',
        image: 'https://cdn1.vectorstock.com/i/1000x1000/75/80/spiderman-push-ups-exercise-vector-34857580.jpg',
    },
];

const ExerciseGrid = () => {
    return (
        <Grid container spacing={2} sx={{ maxWidth: 1200, margin: 'auto', mt: 4 }}>
            {exercises.map((exercise) => (
                <Grid item xs={6} sm={4} md={2} key={exercise.exerciseId}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="300"
                            image={exercise.image}
                            alt={exercise.name}
                        />
                        <CardContent>
                            <Typography variant="subtitle1" align="center">
                                {exercise.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ExerciseGrid;
