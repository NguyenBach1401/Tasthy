import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, TextField, Button, IconButton
} from '@mui/material';
import { addComment, delComment, updateComment, getComments } from '../Services/AppServices/CommentService';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';


const CommentsSection = ({ recipe, userId, isAuthenticated, userName }) => {
    const [comment, setComment] = useState('');
    const pageSize = 5;
    const [commentPage, setCommentPage] = useState(1);
    const [currentComments, setCurrentComments] = useState([]);

    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [allComments, setAllComments] = useState(recipe.comments || []);
    const [totalComments, setTotalComments] = useState(0);



    const totalPages = Math.ceil(allComments / pageSize) || 0;
    const fetchComments = async () => {
        try {
            const data = await getComments(recipe.recipeID, commentPage, pageSize);
            setCurrentComments(data.comments);
            setAllComments(data.totalComments);
            setTotalComments(data.totalComments);
        } catch (err) {
            console.error('Lỗi lấy comments:', err);
        }
    };
    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        try {
            await addComment(userId, recipe.recipeID, newComment);
            setNewComment('');
            setCommentPage(1);
            fetchComments();
            toast.success('Gửi bình luận thành công!');
        } catch (error) {
            toast.error('Gửi bình luận thất bại!');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await delComment(commentId, userId);
            fetchComments();
            toast.success('Xóa bình luận thành công!');
        } catch (error) {
            toast.error('Xóa bình luận thất bại!');
        }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await updateComment(commentId, userId, editingContent);
            setEditingCommentId(null);
            fetchComments();
            toast.success('Cập nhật bình luận thành công!');
        } catch (error) {
            toast.error('Cập nhật bình luận thất bại!');
        }
    };
    useEffect(() => {
        if (recipe?.recipeID) {
            fetchComments();
        }
    }, [recipe.recipeID, commentPage]);
    return (

        <Box mt={6}>
            <Typography variant="h6" fontWeight="bold" fontSize="1.2rem" gutterBottom>
                Bình luận
            </Typography>
            {!isAuthenticated ? (
                <Box
                    p={2}
                    bgcolor="#f9f9f9"
                    border="1px solid #ddd"
                    borderRadius={2}
                    mb={2}
                >
                    <Typography>
                        Vui lòng <a href="/login" style={{
                            color: 'red',
                            textDecoration: "none", fontWeight: 'bold'
                        }}>Đăng Nhập</a> để bình luận!
                    </Typography>
                </Box>
            ) :
                (
                    <Box mt={3}>
                        <TextField
                            fullWidth
                            label="Viết bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            multiline
                            rows={3}
                        />
                        <Button variant="contained" color="error" onClick={handleSubmitComment} sx={{ mt: 1, mb: 3 }}>
                            Gửi bình luận
                        </Button>
                    </Box>
                )}
            {totalComments === 0 ? (
                <Typography>Chưa có bình luận nào</Typography>
            ) : (
                <>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        {currentComments.map((cmt) => (
                            <Box key={cmt.commentID} mb={2} display="flex" alignItems="flex-start" gap={2}>
                                <Avatar sx={{ bgcolor: '#0288d1' }}>{cmt.name[0].toUpperCase()}</Avatar>

                                <Box flex={1} display="flex" justifyContent="space-between" width="100%">
                                    {/* Nội dung bên trái */}
                                    <Box>
                                        <Typography fontWeight="bold">{cmt.name}</Typography>
                                        <Typography fontSize="0.95rem" color="text.secondary">
                                            {new Date(cmt.createdAt).toLocaleDateString()}
                                        </Typography>

                                        {editingCommentId === cmt.commentID ? (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={editingContent}
                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                    multiline
                                                />
                                                <Box mt={1}>
                                                    <IconButton color="primary" onClick={() => handleUpdateComment(cmt.commentID)}>
                                                        <Save />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => setEditingCommentId(null)}>
                                                        <Cancel />
                                                    </IconButton>
                                                </Box>
                                            </>
                                        ) : (
                                            <Typography>{cmt.content}</Typography>
                                        )}
                                    </Box>


                                    {isAuthenticated && cmt.userName === userName && editingCommentId !== cmt.commentID && (
                                        <Box>
                                            <IconButton color="warning" onClick={() => {
                                                setEditingCommentId(cmt.commentID);
                                                setEditingContent(cmt.content);
                                            }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteComment(cmt.commentID)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                        ))}
                    </Box>

                    <Box mt={2} display="flex" justifyContent="center" alignItems="center" gap={2}>
                        <Button variant="outlined" disabled={commentPage === 1} onClick={() => setCommentPage(p => p - 1)}>&lt;</Button>
                        <Typography>{commentPage} / {totalPages}</Typography>
                        <Button variant="outlined" disabled={commentPage === totalPages} onClick={() => setCommentPage(p => p + 1)}>&gt;</Button>
                    </Box>
                </>
            )}


        </Box>
    );
};

export default CommentsSection;