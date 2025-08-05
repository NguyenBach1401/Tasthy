import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    CircularProgress,
    Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const ExercisePickModal = ({
    open,
    onClose,
    selectedMuscles,
    onPick
}) => {
    const [exerciseMap, setExerciseMap] = useState({});
    const [loadingMap, setLoadingMap] = useState({});



    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Chọn bài tập theo nhóm cơ</DialogTitle>
            <DialogContent>
                {selectedMuscles.map((muscle) => (
                    <Accordion key={muscle}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{muscle}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {loadingMap[muscle] ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Grid container spacing={2}>
                                    {(exerciseMap[muscle] || []).map((exercise) => (
                                        <Grid item xs={12} sm={6} key={exercise.exerciseId}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {exercise.name}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                {exercise.description}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<FlashOnIcon />}
                                                onClick={() => onPick(exercise)}
                                            >
                                                Chọn
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default ExercisePickModal;
