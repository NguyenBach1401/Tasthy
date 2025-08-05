import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card,
    CardContent, IconButton,
    Grid, TextField,
    MenuItem, Button,
    Avatar, Stack,
    Alert, CircularProgress
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Pie, PieChart } from 'recharts';
import { getProfile, updateProfile, getUserHealthSummary } from '../../Services/AppServices/UserService';
import JourneyTab from './Journey/JourneyTab';

function Profile({ token }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [activityLevel, setActivityLevel] = useState('');
    const [summary, setSummary] = useState({
        totalSystemExercises: 0,
        totalCustomExercises: 0,
        totalSystemMeals: 0,
        totalCustomMeals: 0,
    });


    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const data = await getProfile(token);
                setProfile(data);
                setFormData(data);
            } catch (err) {
                setError('Không thể tải thông tin hồ sơ');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getUserHealthSummary();
                setSummary(data);
            } catch (err) {
                // handle error
            }
        };

        fetchSummary();
    }, []);


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfile(token, formData);
            const updatedProfile = await getProfile(token);
            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setEditMode(false);
        } catch (err) {
            alert('Lỗi khi cập nhật hồ sơ');
            console.error(err);
        }
    };
    const thresholds = {
        bmi: { min: 18.5, max: 24.9 },
    };

    const getColor = (key, current, standard) => {
        if (key === 'bmi') {
            if (current < thresholds.bmi.min) return '#fdd835';
            if (current > thresholds.bmi.max) return '#e53935';
            return '#43a047';
        } else {
            if (current < standard) return '#fdd835';
            if (current > standard) return '#e53935';
            return '#43a047';
        }
    };
    const { bmi, bmr, tdee } = profile || {};

    // Placeholder values for dailyBMR and dailyTDEE
    const dailyBMR = 1300; // sau này sẽ tính từ món ăn
    const dailyTDEE = 2200; // sau này sẽ tính từ bài tập

    const activityOptions = [
        { value: '1', label: '1 - Người ít hoặc gần như không vận động' },
        { value: '2', label: '2 - Vận động thể chất, tập thể dục từ 1-2 ngày/tuần' },
        { value: '3', label: '3 - Vận động thể chất, tập thể dục từ 3-4 ngày/tuần' },
        { value: '4', label: '4 - Vận động thể chất, tập thể dục từ 5-6 ngày/tuần' },
        { value: '5', label: '5 - Vận động thể chất, tập thể thao hơn 90 phút/ngày hoặc làm công việc nặng nhọc' }
    ];
    const handleChangeAction = (event) => {
        setActivityLevel(event.target.value);
    };
    // Xác định màu của thanh tiêu chuẩn
    const getStandardColor = (key, value) => {
        const { min, max } = thresholds[key];
        if (value < min) return '#fdd835'; // vàng
        if (value > max) return '#e53935'; // đỏ
        return '#43a047'; // xanh lá
    };
    if (!token) return <Alert severity="warning">Bạn cần đăng nhập để xem hồ sơ.</Alert>;
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Card
                sx={{
                    width: { xs: '90%', sm: '80%', md: '100%' },
                    maxWidth: 1200,
                    mx: 'auto',
                    mt: 4,
                    mb: 5,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    boxShadow: 4,
                    bgcolor: '#fafafa',
                    border: '1px solid #e0e0e0',
                }}
            >
                <Grid container spacing={4}>
                    {/* Thông tin bên trái */}
                    <Grid item xs={12} md={5}>
                        <Box sx={{
                            maxWidth: 400, // Giới hạn chiều rộng tối đa
                            width: '100%',
                        }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" gutterBottom>
                                    Thông tin cá nhân
                                </Typography>
                                <IconButton onClick={() => setEditMode(!editMode)}>
                                    <SettingsOutlinedIcon sx={{ color: 'deepskyblue' }} fontSize="large" />
                                </IconButton>
                            </Box>

                            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                <Avatar sx={{ width: 64, height: 64, bgcolor: '#90caf9' }}>
                                    {profile.name?.charAt(0)}
                                </Avatar>
                                <Typography variant="h6">{profile.name}</Typography>
                                {profile.gender === 'Nam' ? (
                                    <MaleIcon color="primary" />
                                ) : (
                                    <FemaleIcon color="error" />
                                )}
                            </Stack>

                            <Grid container spacing={2}>
                                {[ // các trường dữ liệu để hiển thị hoặc chỉnh sửa
                                    { label: 'Email', key: 'email' },
                                    { label: 'Tuổi', key: 'age', type: 'number' },
                                    { label: 'Giới tính', key: 'gender', select: true, options: ['Nam', 'Nữ'] },
                                    { label: 'Chiều cao (cm)', key: 'heightCm', type: 'number' },
                                    { label: 'Cân nặng (kg)', key: 'weightKg', type: 'number' },
                                    {
                                        label: 'Mức độ vận động',
                                        key: 'activityLevel',
                                        select: true,
                                        options: [
                                            { value: '1', label: '1 - Ít vận động' },
                                            { value: '2', label: '2 - Tập thể dục 1-3 ngày/tuần' },
                                            { value: '3', label: '3 - Tập thể dục 3-5 ngày/tuần' },
                                            { value: '4', label: '4 - Tập thể dục 5-7 ngày/tuần' },
                                            { value: '5', label: '5 - Tập thể dục trên 90 phút/ngày hoặc công việc nặng' }
                                        ]
                                    },
                                    {
                                        label: 'Mục tiêu',
                                        key: 'goal',
                                        select: true,
                                        options: [
                                            { value: '1', label: 'Giảm cân nhanh' },
                                            { value: '2', label: 'Giảm cân nhẹ' },
                                            { value: '3', label: 'Duy trì thể trạng' },
                                            { value: '4', label: 'Tăng cơ nhẹ' },
                                            { value: '5', label: 'Tăng cân nhanh' }
                                        ]
                                    },
                                    { label: 'BMI', key: 'bmi', disabled: true },
                                    { label: 'BMR', key: 'bmr', disabled: true },
                                    { label: 'TDEE', key: 'tdee', disabled: true },
                                    { label: 'Calories cần thiết', key: 'caloriesGoal', disabled: true }
                                ].map(field => {
                                    const rawValue = profile[field.key];
                                    let displayValue = rawValue;

                                    if (!editMode && field.select && Array.isArray(field.options)) {
                                        const match = field.options.find(opt =>
                                            typeof opt === 'object' ? opt.value === rawValue : opt === rawValue
                                        );
                                        displayValue = typeof match === 'object' ? match.label : match || rawValue;
                                    }
                                    if (!editMode && ['bmi', 'bmr', 'tdee', 'caloriesGoal'].includes(field.key)) {
                                        const parsed = parseFloat(rawValue);
                                        if (!isNaN(parsed)) {
                                            displayValue = Math.round(parsed);
                                        }
                                    }

                                    return (
                                        <Box key={field.key} sx={{ width: 300 }}>
                                            {editMode && !field.disabled ? (
                                                field.select ? (
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        label={field.label}
                                                        name={field.key}
                                                        value={formData[field.key] || ''}
                                                        onChange={handleChange}
                                                    >
                                                        {field.options.map(opt =>
                                                            typeof opt === 'string' ? (
                                                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                            ) : (
                                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                            )
                                                        )}
                                                    </TextField>
                                                ) : (
                                                    <TextField
                                                        fullWidth
                                                        label={field.label}
                                                        name={field.key}
                                                        type={field.type || 'text'}
                                                        value={formData[field.key] || ''}
                                                        onChange={handleChange}
                                                    />
                                                )
                                            ) : (
                                                <Typography>
                                                    <strong>{field.label}:</strong> {displayValue}
                                                </Typography>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Grid>

                            {editMode && (
                                <Box mt={3}>
                                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                                    <Button
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData(profile);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Biểu đồ và đánh giá sức khỏe + Thống kê */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="h6" mb={2}>Chỉ số BMI</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart layout="vertical" data={[
                                    { name: 'Hiện tại', value: bmi, key: 'bmi' },
                                    { name: 'Tiêu chuẩn', value: 22, key: 'bmiStandard' },
                                ]}>
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Bar dataKey="value" barSize={20}>
                                        <Cell fill={getColor('bmi', bmi, 22)} />
                                        <Cell fill="#0288d1" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            {(bmi < thresholds.bmi.min || bmi > thresholds.bmi.max) && (
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    BMI {bmi < thresholds.bmi.min ? 'thấp' : 'cao'} hơn mức bình thường.
                                </Alert>
                            )}
                            <Typography mt={3}>
                                <strong>Đánh giá:</strong>{' '}
                                {bmi < thresholds.bmi.min ? 'Bạn đang thiếu cân, hãy bổ sung dinh dưỡng hợp lý.' :
                                    bmi > thresholds.bmi.max ? 'Bạn đang thừa cân, nên điều chỉnh chế độ ăn và vận động.' :
                                        'BMI của bạn đang ở mức hợp lý. Hãy tiếp tục duy trì!'}
                            </Typography>
                        </Box>

                        {/* Thống kê bài tập và món ăn */}
                        <Box mt={5} textAlign="center">
                            <Typography variant="h6" mb={2}>Hoạt động tổng thể</Typography>

                            <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" mb={3}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <FitnessCenterIcon color="primary" />
                                    <Typography>
                                        Bài tập: {summary.totalSystemExercises + summary.totalCustomExercises}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <RestaurantIcon color="error" />
                                    <Typography>
                                        Món ăn: {summary.totalSystemMeals + summary.totalCustomMeals}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Grid container spacing={4} justifyContent="center">
                                <Grid item>
                                    <Box sx={{ width: 250 }}>
                                        <Typography fontWeight="bold" gutterBottom>
                                            Bài tập
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={[
                                                        { name: 'Hệ thống', value: summary.totalSystemExercises, fill: '#42a5f5' },
                                                        { name: 'Tự thêm', value: summary.totalCustomExercises, fill: '#ab47bc' }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box sx={{ width: 250 }}>
                                        <Typography fontWeight="bold" gutterBottom>
                                            Món ăn
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <PieChart>
                                                <Pie
                                                    dataKey="value"
                                                    data={[
                                                        { name: 'Hệ thống', value: summary.totalSystemMeals, fill: '#66bb6a' },
                                                        { name: 'Tự thêm', value: summary.totalCustomMeals, fill: '#ffa726' }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                    </Grid>
                </Grid>
                <Card sx={{
                    p: 3, borderRadius: 3, bgcolor: '#fafafa',
                    border: '1px solid #e0e0e0',
                    boxShadow: 4,
                }}>
                    <JourneyTab />
                </Card>
            </Card>

        </>

    );
};


export default Profile;
