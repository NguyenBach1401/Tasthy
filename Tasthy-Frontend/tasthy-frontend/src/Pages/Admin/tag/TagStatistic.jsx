import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, FormControl, Pagination, TextField,
    Select, MenuItem, IconButton, Button
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import { getAllTags, deleteTag } from '../../../Services/AdminServices/AdminTagService';
import AddTagModal from './addTag';
import ConfirmDelete from '../../../Component/modal/ConfirmDelete'
import EditTagModal from './editTag';

function AdminTagList() {
    const token = localStorage.getItem('token');
    const [tags, setTags] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deletingTag, setDeletingTag] = useState(null);

    const totalPages = Math.ceil(totalRecords / pageSize);

    const fetchTags = async () => {
        try {
            setIsLoading(true);
            const data = await getAllTags(token, page, pageSize, keyword);
            setTags(data.tags || []);
            setTotalRecords(data.totalRecords || 0);
        } catch (error) {
            console.error('Lỗi khi tải danh sách thẻ:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, [token, page, pageSize, keyword]);

    const handlePageChange = (_, value) => setPage(value);
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPage(1);
    };

    const handleDelete = (tag) => {
        setDeletingTag(tag);
        setOpenDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        if (!deletingTag) return;

        try {
            console.log(deletingTag.tagID)
            await deleteTag(deletingTag.tagID);

            fetchTags();
        } catch (error) {
            console.error('Delete failed', error);
        } finally {
            setOpenDeleteModal(false);
            setDeletingTag(null);
        }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setOpenEditModal(true);
    };

    const handleOpenAddModal = () => {
        setOpenAddModal(true);
    };


    const handleTagCreated = () => {
        setOpenAddModal(false);
        fetchTags();
    };
    const renderTableBody = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ height: 200 }}>
                        Đang tải dữ liệu...
                    </TableCell>
                </TableRow>
            );
        }

        if (tags.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ height: 200 }}>
                        Không có dữ liệu.
                    </TableCell>
                </TableRow>
            );
        }

        return tags.map((tag, index) => (
            <TableRow
                key={tag.tagID}
                sx={{
                    '&:hover': { backgroundColor: '#F3F9FF' },
                    transition: 'background-color 0.3s'
                }}
            >
                <TableCell sx={{ fontSize: '18px' }}>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell sx={{
                    fontSize: '18px',
                    color: 'rgb(21, 64, 82)',
                    fontWeight: 500
                }}
                >{tag.tagName}</TableCell>
                <TableCell align="center" sx={{ fontSize: '18px' }}>{tag.recipeCount}</TableCell>
                <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(tag)}>
                        <EditOutlinedIcon fontSize="large" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(tag)}>
                        <DeleteOutlineOutlinedIcon fontSize="large" />
                    </IconButton>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Paper elevation={3} sx={{ p: 5 }}>
            <Typography variant="h5" gutterBottom >
                Danh sách thẻ Tag
            </Typography>
            <Box display="flex" gap={2} mb={2} flexWrap="wrap"
                justifyContent={'space-between'}>
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    sx={{
                        minWidth: 220,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            fontSize: '18px',
                            '& input': {
                                fontSize: '18px'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: '16px'
                        }
                    }}
                />
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddModal} color="success"
                    sx={{ fontSize: '20px' }}>
                    Thêm thẻ
                </Button>

                <AddTagModal
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onTagCreated={handleTagCreated}
                />
                <ConfirmDelete
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                />
                <EditTagModal
                    open={openEditModal}
                    tag={editingTag}
                    onClose={() => setOpenEditModal(false)}
                    onTagUpdated={fetchTags}
                />

            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                            <TableCell sx={{ fontSize: '20px' }}>STT</TableCell>
                            <TableCell sx={{ fontSize: '20px' }}>Tên thẻ</TableCell>
                            <TableCell sx={{ fontSize: '20px' }} align="center">Số món ăn</TableCell>
                            <TableCell sx={{ fontSize: '20px' }} align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTableBody()}</TableBody>
                </Table>
            </TableContainer>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                flexWrap="wrap"
                gap={2}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography>Hiển thị:</Typography>
                    <FormControl size="small">
                        <Select value={pageSize} onChange={handlePageSizeChange}>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Paper>
    );
}
export default AdminTagList;