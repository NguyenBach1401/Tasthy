import React, { useEffect, useState, useCallback } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Box, TextField, FormControl, Select, MenuItem, Button,
    Pagination, Tooltip, IconButton
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import { getAllExercises } from '../../Services/AdminServices/AdminExerciseService';
import AddExerciseModal from './Exercise/AddExercise';
import EditExerciseModal from './Exercise/EditExercise';


function AdminExerciseList() {
    const token = localStorage.getItem('token');
    const [exercises, setExercises] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [requiresEquipment, setRequiresEquipment] = useState('');

    const totalPages = Math.ceil(totalRecords / pageSize);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [selected, setSelected] = useState(null);

    const fetchExercises = useCallback(async () => {
        try {
            const data = await getAllExercises(
                page,
                pageSize,
                keyword,
                requiresEquipment
            );
            setExercises(data.exercises || []);
            setTotalRecords(data.totalRecords || 0);
        } catch (err) {
            console.error("Lỗi khi tải danh sách bài tập:", err);
        }
    }, [page, pageSize, keyword, requiresEquipment]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises, refreshFlag]);

    const handlePageChange = (_, value) => setPage(value);
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPage(1);
    };
    const handleEditClick = (exercise) => {
        setSelected(exercise);
        setOpenEdit(true);
    };

    const handleAddSuccess = () => {
        setRefreshFlag((f) => f + 1);
    };

    const renderTableBody = () => {
        if (exercises.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ height: 200, fontSize: '18px' }}>
                        Không có dữ liệu.
                    </TableCell>
                </TableRow>
            );
        }

        return exercises.map((ex, index) => (
            <TableRow
                key={ex.exerciseId}
                sx={{ '&:hover': { backgroundColor: '#F3F9FF' }, transition: 'background-color 0.3s' }}
            >
                <TableCell sx={{ fontSize: '18px' }}>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell sx={{
                    fontSize: '18px', color: 'rgb(21, 64, 82)',
                    fontWeight: 500
                }}>
                    {ex.name}</TableCell>
                <TableCell sx={{
                    fontSize: '18px', color: 'rgb(21, 64, 82)',
                    fontWeight: 500
                }}>
                    {ex.description}</TableCell>
                <TableCell sx={{ fontSize: '18px' }} align="center">{ex.difficultyLevel}</TableCell>
                <TableCell sx={{ fontSize: '18px' }} align="center">{ex.caloriesBurnedPerRep}</TableCell>
                <TableCell align="center">
                    {ex.requiresEquipment ? (
                        <Tooltip title="Cần thiết bị">
                            <FitnessCenterIcon fontSize="large" color="primary" />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Không cần thiết bị">
                            <DoNotDisturbAltIcon fontSize="large" color="error" />
                        </Tooltip>
                    )}
                </TableCell>
                <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEditClick(ex)}>
                        <EditOutlinedIcon fontSize="large" />
                    </IconButton>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Paper elevation={3} sx={{ p: 5, width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                Danh sách bài tập thể thao
            </Typography>

            <Box display="flex" mb={2} flexWrap="wrap" justifyContent="space-between">
                <Box display="flex" gap={2}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{ minWidth: 220 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                            value={requiresEquipment}
                            onChange={(e) => setRequiresEquipment(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="">Thiết bị</MenuItem>
                            <MenuItem value="true">Cần thiết bị</MenuItem>
                            <MenuItem value="false">Không cần thiết bị</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    color="success"
                    sx={{ fontSize: "20px" }}
                    onClick={() => setOpen(true)}
                >
                    Thêm bài tập
                </Button>
                <AddExerciseModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSuccess={handleAddSuccess}
                />
            </Box>

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }}>STT</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }}>Tên bài tập</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }}>Mô tả</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }} align="center">Độ khó</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }} align="center">Calo/rep</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }} align="center">Thiết bị</TableCell>
                                <TableCell sx={{ fontSize: '20px', whiteSpace: 'nowrap' }} align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderTableBody()}</TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
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
            <EditExerciseModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSuccess={handleAddSuccess}
                exercise={selected}
            />
        </Paper>

    );
}

export default AdminExerciseList;
