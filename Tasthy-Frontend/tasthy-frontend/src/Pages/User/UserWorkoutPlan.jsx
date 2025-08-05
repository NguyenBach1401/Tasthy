import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableHead,
    TableBody, TableRow, TableCell, TableContainer,
    Paper, CircularProgress, IconButton, FormControl, InputLabel,
    Select, MenuItem, Grid, Pagination, LinearProgress, Dialog
} from '@mui/material';
import { getUserWorkoutPlansWithProgress } from '../../Services/AppServices/UserWorkoutPlanService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UserWorkoutPlanDetail from './UserWorkoutPlanDetail';


const UserWorkoutPlanPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 10,
        goal: '',
        difficultyLevel: '',
        isComplete: '',
    });

    const userId = localStorage.getItem('userId');

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const res = await getUserWorkoutPlansWithProgress(userId, {
                ...filters,
                pageNumber: page,
                pageSize: pageSize,
            });
            console.log("DATA:", res);
            setPlans(res.items || res.Items || []);
            setTotalCount(res.totalCount || res.TotalCount || 0);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách kế hoạch tập:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchPlans();
    }, [filters, userId, page, pageSize]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            pageNumber: 1, // reset về trang 1 khi thay đổi filter
        }));
    };
    const handlePageChange = (_, value) => {
        setPage(value);

    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value, 10));
        setPage(1); // Reset về trang đầu khi thay đổi số dòng/trang
    };
    const handleOpenDetail = (planId) => {
        setSelectedPlanId(planId);
    };
    const handleCloseDialog = () => {
        setSelectedPlanId(null);
        fetchPlans();
    };


    const totalPages = Math.ceil(totalCount / pageSize);
    return (
        < Box sx={{ px: 4, py: 3 }}>
            <Typography variant="h5" gutterBottom>
                Danh sách kế hoạch tập luyện
            </Typography>

            {/* Bộ lọc */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 200,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            },
                            '&:hover': {
                                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.15)'
                            }
                        }}

                    >

                        <InputLabel>Mục tiêu</InputLabel>
                        <Select
                            name="goal"
                            value={filters.goal}
                            onChange={handleFilterChange}
                            label="Mục tiêu"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Tăng cơ">Tăng cơ</MenuItem>
                            <MenuItem value="Giảm cân">Giảm can</MenuItem>
                            <MenuItem value="Giữ dáng">Giữ dáng</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 200,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    >

                        <InputLabel>Độ khó</InputLabel>
                        <Select
                            name="difficultyLevel"
                            value={filters.difficultyLevel}
                            onChange={handleFilterChange}
                            label="Độ khó"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="1">Dễ</MenuItem>
                            <MenuItem value="2">Trung bình</MenuItem>
                            <MenuItem value="3">Khó</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 200,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    >

                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="isComplete"
                            value={filters.isComplete}
                            onChange={handleFilterChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="true">Hoàn thành</MenuItem>
                            <MenuItem value="false">Chưa hoàn thành</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Box sx={{ overflowX: 'auto', width: '100%', borderRadius: 2 }}>
                        <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto', boxShadow: 2 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableRow>
                                        {['STT', 'Tên Routine', 'Mục tiêu', 'Độ khó', 'Số lần', 'Số ngày', 'Ngày bắt đầu', 'Ngày hiện tại', 'Ngày đã tập', 'Tổng số ngày', 'Tiến độ (%)', 'Hành động'].map((header, idx) => (
                                            <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plans.map((plan, idx) => (
                                        <TableRow
                                            key={plan.userWorkoutPlanId}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#fafafa',
                                                    cursor: 'pointer'
                                                }
                                            }}
                                        >
                                            <TableCell align="center">{(page - 1) * pageSize + idx + 1}</TableCell>
                                            <TableCell align="center">{plan.routineName}</TableCell>
                                            <TableCell align="center">{plan.goal}</TableCell>
                                            <TableCell align="center">
                                                {plan.difficultyLevel === "1" ? "Dễ" :
                                                    plan.difficultyLevel === "2" ? "Trung bình" : "Khó"}
                                            </TableCell>
                                            <TableCell align="center">{plan.durationWeeks}</TableCell>
                                            <TableCell align="center">{plan.daysPerWeek}</TableCell>
                                            <TableCell align="center">{new Date(plan.startDate).toLocaleDateString()}</TableCell>
                                            <TableCell align="center">{plan.currentDay}</TableCell>
                                            <TableCell align="center">{plan.daysCheckedIn}</TableCell>
                                            <TableCell align="center">{plan.totalDays}</TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                                                    <Box width={100}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={plan.progressPercent}
                                                            sx={{
                                                                height: 10,
                                                                borderRadius: 5,
                                                                backgroundColor: '#e0e0e0',
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: plan.progressPercent < 100 ? '#1976d2' : '#2e7d32'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" minWidth={35}>
                                                        {Math.round(plan.progressPercent)}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleOpenDetail(plan.userWorkoutPlanId)}
                                                    sx={{
                                                        color: '#1976d2',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                                        }
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                            <Dialog
                                                open={!!selectedPlanId}
                                                onClose={handleCloseDialog}
                                                maxWidth="lg"
                                                fullWidth
                                                PaperProps={{
                                                    sx: {
                                                        borderRadius: 3,
                                                        p: 2
                                                    }
                                                }}
                                            >
                                                {selectedPlanId && <UserWorkoutPlanDetail userWorkoutPlanId={selectedPlanId} />}
                                            </Dialog>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Pagination */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={3}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontWeight={500}>Hiển thị:</Typography>
                            <FormControl size="small">
                                <Select value={pageSize} onChange={handlePageSizeChange}>
                                    <MenuItem value={1}>1</MenuItem>
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
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: '50%'
                                }
                            }}
                        />
                    </Box>

                </>
            )}
        </Box>
    );
};
export default UserWorkoutPlanPage;