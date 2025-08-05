import React, { useState } from "react";
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Divider,
    Grid,
    Button,
    Modal,
} from "@mui/material";


const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    maxHeight: "90vh",
    overflowY: "auto",
    width: { xs: "95%", md: "90%", lg: "80%" },
    borderRadius: 3,
    p: { xs: 2, md: 4 },
};

function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
}

export default function RecipeDetailModal({ open, onClose, recipe }) {



    const handleTagClick = (tag) => {
        // Logic khi click tag nếu cần
        console.log("Clicked tag:", tag);
    };

    if (!recipe) return null;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="recipe-modal-title" closeAfterTransition>
            <Box sx={styleModal} onClick={(e) => e.stopPropagation()}>
                <Box sx={{ px: { xs: 2, md: 6, lg: 10 }, py: 4 }}>
                    {/* Tags */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {recipe.tags.map((tag, idx) => (
                            <Chip
                                key={idx}
                                label={typeof tag === "string" ? tag : tag.name}
                                color="error"
                                variant="outlined"
                                onClick={() => handleTagClick(tag)}
                                sx={{ cursor: "pointer" }}
                            />
                        ))}
                    </Box>


                    <Typography variant="h3" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
                        {recipe.title}

                    </Typography>

                    {/* Description */}
                    <Typography variant="body1" fontSize="1.2rem" sx={{ mb: 3 }}>
                        {recipe.description}
                    </Typography>

                    {/* Author + Date */}
                    <Typography variant="h6" fontSize="1.2rem" fontWeight="bold">
                        {recipe.userName}
                    </Typography>
                    <Typography fontStyle="italic" fontSize="1.1rem" sx={{ mb: 2 }}>
                        Đăng tải ngày {formatDate(recipe.createdAt)}
                    </Typography>

                    {/* Cooking time */}
                    <Typography fontWeight="bold" fontSize="1.1rem" sx={{ mb: 4 }}>
                        Thời gian nấu: {recipe.cookingTime} phút
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    {/* Grid layout */}
                    <Grid container spacing={4} alignItems="flex-start">
                        {/* Left: Ingredients & Nutrition */}
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="h6" fontSize="1.2rem" fontWeight="bold" sx={{ mb: 1 }}>
                                    Nguyên liệu cho {recipe.servings} khẩu phần
                                </Typography>
                                <Typography whiteSpace="pre-line" fontSize="1.2rem" sx={{ mb: 3 }}>
                                    {recipe.ingredients}
                                </Typography>

                                {recipe.nutrition ? (
                                    <Box>
                                        <Typography variant="h6" fontSize="1.2rem" fontWeight="bold" sx={{ mb: 1 }}>
                                            Giá trị dinh dưỡng
                                        </Typography>
                                        <Typography fontSize="1.2rem">Calories: {recipe.nutrition.calories}</Typography>
                                        <Typography fontSize="1.2rem">Carbs: {recipe.nutrition.carbs}g</Typography>
                                        <Typography fontSize="1.2rem">Fat: {recipe.nutrition.fat}g</Typography>
                                        <Typography fontSize="1.2rem">Protein: {recipe.nutrition.protein}g</Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="h6" fontSize="1.2rem" fontWeight="bold" sx={{ mb: 1 }}>
                                            Giá trị dinh dưỡng
                                        </Typography>
                                        <Typography fontStyle="italic" color="text.secondary">
                                            Không có thông tin dinh dưỡng.
                                        </Typography>
                                    </Box>
                                )}


                            </Box>
                        </Grid>

                        {/* Center: Instructions */}
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    maxWidth: { md: "650px" },
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                }}
                            >
                                <Typography variant="h6" fontSize="1.2rem" fontWeight="bold" sx={{ mb: 2 }}>
                                    Cách chế biến
                                </Typography>
                                {recipe.instructions.split("\n").map((step, idx) => (
                                    <Typography
                                        key={idx}
                                        fontSize="1.2rem"
                                        sx={{
                                            mb: 1,
                                            whiteSpace: "pre-line",
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        <strong>{idx + 1}.</strong> {step}
                                    </Typography>
                                ))}
                            </Box>
                        </Grid>

                        {/* Right: Image */}
                        <Grid item xs={12} md={4}>
                            <Box>
                                <img
                                    src={recipe.recipeIMG}
                                    alt="Ảnh món ăn"
                                    style={{
                                        width: 300,
                                        borderRadius: 12,
                                        objectFit: "cover",
                                        maxHeight: 300,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}
