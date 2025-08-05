import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
    Select, MenuItem, TextField, InputLabel, FormControl, Pagination,
    IconButton, Tooltip, Chip
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getAllUsers } from '../../Services/AdminServices/AdminUserService';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

function AdminUserList() {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const totalPages = Math.ceil(totalRecords / pageSize);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUsers(token, page, pageSize, keyword, gender, activityLevel);
            setUsers(data.users || []);
            setTotalRecords(data.totalRecords || 0);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handlePageChange = (_, value) => setPage(value);
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPage(1);
    };
    useEffect(() => {
        fetchUsers();
    }, [token, page, pageSize, keyword, gender, activityLevel]);

    const handleDelete = async (userId) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            try {
                console.log('Đã xóa')
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
            }
        }
    };
    const goalLabels = {
        '1': 'Giảm cân nhanh',
        '2': 'Giảm cân nhẹ',
        '3': 'Duy trì thể trạng',
        '4': 'Tăng cơ nhẹ',
        '5': 'Tăng cân nhanh',
    };
    const renderTableBody = () => {
        if (isLoading) {
            return (
                <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ height: 200 }}>
                        Đang tải dữ liệu...
                    </TableCell>
                </TableRow>
            );
        }

        if (users.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ height: 200 }}>
                        Không có dữ liệu.
                    </TableCell>
                </TableRow>
            );
        }

        return users.map((user, index) => (
            <TableRow
                key={user.userID}
                sx={{
                    '&:hover': { backgroundColor: '#F3F9FF' },
                    transition: 'background-color 0.3s'
                }}
            >
                <TableCell sx={{ fontSize: '18px' }}>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>{user.name}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>{user.email}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>{user.age ?? '-'}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>
                    {user.gender === 'Nam' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <MaleIcon color="primary" />
                            Nam
                        </Box>
                    ) : user.gender === 'Nữ' ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <FemaleIcon sx={{ color: 'deeppink' }} />
                            Nữ
                        </Box>
                    ) : (
                        '-'
                    )}
                </TableCell>
                <TableCell sx={{ fontSize: '18px' }}>{user.heightCm ?? '-'}</TableCell>
                <TableCell sx={{ fontSize: '18px' }}>{user.weightKg ?? '-'}</TableCell>

                {/* <TableCell sx={{ fontSize: '18px' }}>{renderActivityLevel(user.activityLevel)}</TableCell> */}
                <TableCell >
                    {renderActivityLevel(user.activityLevel)}
                </TableCell>
                <TableCell sx={{ fontSize: '18px' }}> {goalLabels[user.goal] || '-'}</TableCell>
                {/* <TableCell align="center">
                    <Tooltip title="Xoá người dùng">
                        <IconButton onClick={() => handleDelete(user.userID)}>
                            <DeleteOutlineOutlinedIcon color="error" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </TableCell> */}
            </TableRow>
        ));
    };

    const renderActivityLevel = (level) => {
        const map = {
            1: { label: 'Ít vận động', color: '#9e9e9e' },
            2: { label: 'Vận động nhẹ', color: '#81c784' },
            3: { label: 'Vận động vừa', color: '#4db6ac' },
            4: { label: 'Vận động nhiều', color: '#64b5f6' },
            5: { label: 'Rất năng động', color: '#f06292' }
        };

        const item = map[level];

        if (!item) {
            return <Chip label="-" variant="outlined" />;
        }

        return (
            <Chip
                label={item.label}
                variant="outlined"
                sx={{
                    color: item.color,
                    borderColor: item.color,
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 1,
                    '& .MuiChip-label': {
                        fontSize: '20px'
                    }
                }}
            />
        );
    };

    return (
        <Paper elevation={3} sx={{ p: 5 }}>
            <Typography variant="h5" gutterBottom>Danh sách người dùng</Typography>

            <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                <TextField
                    label="Tìm kiếm (họ tên, email)"
                    variant="outlined"
                    size="small"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    sx={{ minWidth: 220, borderRadius: 5 }}
                />
                <FormControl size="small" sx={{ minWidth: 120, borderRadius: 5 }}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select value={gender} label="Giới tính" onChange={(e) => setGender(e.target.value)}>
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180, borderRadius: 5 }}>
                    <InputLabel>Mức độ hoạt động</InputLabel>
                    <Select value={activityLevel} label="Mức độ hoạt động" onChange={(e) => setActivityLevel(e.target.value)}>
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="1">Ít vận động</MenuItem>
                        <MenuItem value="2">Vận động nhẹ</MenuItem>
                        <MenuItem value="3">Vận động vừa</MenuItem>
                        <MenuItem value="4">Vận động nhiều</MenuItem>
                        <MenuItem value="5">Rất năng động</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                        <TableCell sx={{ fontSize: '20px' }}>STT</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Họ và tên</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Email</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Tuổi</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Giới tính</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Chiều cao (cm)</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Cân nặng (kg)</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Mức độ hoạt động</TableCell>
                        <TableCell sx={{ fontSize: '20px' }}>Mục tiêu</TableCell>
                        {/* <TableCell align="center">Hành động</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>{renderTableBody()}</TableBody>
            </Table>

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
        </Paper>
    );
}

export default AdminUserList;
