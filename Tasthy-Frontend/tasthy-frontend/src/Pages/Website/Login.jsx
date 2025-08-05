import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Container } from '@mui/material';
import { login } from '../../Services/AppServices/UserService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: '',
        password: ''
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(form);
            if (data?.statusCode >= 400) {
                toast.error(data?.message || 'Đăng nhập thất bại')
                throw new Error(data?.message || 'Đăng nhập thất bại');

            }
            console.log('Đăng nhập thành công!');
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.userName);
            localStorage.setItem('userId', data.userID);
            localStorage.setItem('role', data.role)
            console.log(data.userID)
            navigate('/');
            toast.success("Đăng nhập thành công.")
        } catch (error) {
            toast.error("Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập")
            console.log('Đăng nhập thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    return (

        <Box
        // sx={{
        //     minHeight: "100vh",
        //     backgroundImage: `url('/img/background.jpg')`,
        //     backgroundSize: "contain",
        //     backgroundPosition: "center",
        //     display: "flex",
        //     alignItems: "center",
        //     justifyContent: "center",
        // }}
        >



            <Container
                maxWidth="md"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        backgroundColor: "#fff",
                        padding: 4,
                        borderRadius: 3,
                        boxShadow: 4,
                        textAlign: "start",
                    }}
                >
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                        Đăng nhập
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: "text.secondary" }}>
                        Cùng <span style={{ color: "#7ce0f6", fontWeight: 600 }}>Tasthy</span> Khám phá hành trình vừa <b>"Tasty"</b> vừa <b>"Healthy"!</b>
                    </Typography>


                    <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
                        <Grid container spacing={1}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                Tên đăng nhập<span style={{ color: "red", fontWeight: 600 }}>*</span>
                            </Typography>
                            <TextField
                                label="Vui lòng điền thông tin đăng nhập"
                                variant="outlined"
                                fullWidth
                                name="userName"
                                value={form.userName}
                                onChange={handleChange}

                            />

                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                Mật khẩu<span style={{ color: "red", fontWeight: 600 }}>*</span>
                            </Typography>
                            <TextField
                                label="Nhập mật khẩu"
                                type="password"
                                variant="outlined"
                                fullWidth
                                name="password"
                                value={form.password}
                                onChange={handleChange}

                            />

                        </Grid>

                        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        backgroundColor: "#0099FF",
                                        borderRadius: "10px",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        padding: "14px",
                                        "&:hover": {
                                            backgroundColor: "#0099FF",
                                        },
                                    }}
                                >
                                    Đăng Nhập
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginTop: 3, fontSize: 25 }}
                    >
                        Chưa có tài khoản?
                        <a href="/register" style={{
                            color: "#0099FF", textDecoration: "none", fontWeight: 500, fontSize: 25,
                            "&:hover": {
                                textDecoration: "underline black double 5px"
                            },
                        }}>
                            Đăng ký ngay
                        </a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;
