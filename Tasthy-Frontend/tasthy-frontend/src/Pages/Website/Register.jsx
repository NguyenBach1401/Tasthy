import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { register } from '../../Services/AppServices/UserService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [form, setForm] = useState({
        userName: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User'
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};

        if (!form.userName) newErrors.userName = "Tên đăng nhập không được bỏ trống.";
        if (!form.name) newErrors.name = "Họ và tên không được bỏ trống.";

        if (!form.email) {
            newErrors.email = "Email không được bỏ trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Email không đúng định dạng.";
        }

        if (!form.password) {
            newErrors.password = "Mật khẩu không được bỏ trống.";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(form.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số.";
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // clear error
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await register(form);
            toast.success('Đăng ký thành công!');
            navigate('/login');
        } catch (error) {
            toast.error('Đăng ký thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f4fbfd"
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#fff",
                    padding: 4,
                    borderRadius: 3,
                    boxShadow: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#7ce0f6" }}>
                    Cùng Tasthy
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Khám phá hành trình vừa <b>"Tasty"</b> vừa <b>"Healthy"!</b>
                </Typography>

                <Box mt={6}>
                    <Typography variant="h5" gutterBottom>Đăng ký</Typography>

                    <TextField
                        fullWidth label="Tên đăng nhập" name="userName" margin="normal"
                        value={form.userName}
                        onChange={handleChange}
                        error={!!errors.userName}
                        helperText={errors.userName}
                    />
                    <TextField
                        fullWidth label="Họ và tên" name="name" margin="normal"
                        value={form.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        fullWidth label="Email" name="email" margin="normal"
                        value={form.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth label="Mật khẩu" name="password" type="password" margin="normal"
                        value={form.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        fullWidth label="Xác nhận mật khẩu" name="confirmPassword" type="password" margin="normal"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontWeight: "bold", backgroundColor: "#7ce0f6", color: "#000" }}
                        onClick={handleSubmit}
                    >
                        Đăng ký
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Register;
