import {
    AppBar, Toolbar, Box, InputBase, Menu, MenuItem,
    IconButton, Typography, Avatar, ListItemIcon, ListItemText, Select
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('role');
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElSport, setAnchorElSport] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [scope, setScope] = useState('recipes');



    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        navigate('/login');
    };
    const handleOpenSportMenu = (event) => {
        setAnchorElSport(event.currentTarget);
    };

    const handleCloseSportMenu = () => {
        setAnchorElSport(null);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const query = keyword.trim();

            if (scope === "exercises") {
                navigate(
                    query ? `/exercise?kw=${encodeURIComponent(query)}` : "/exercise"
                );
            } else {

                navigate(
                    query
                        ? `/search?scope=recipes&kw=${encodeURIComponent(query)}`
                        : "/search?scope=recipes"
                );

            }
            setKeyword("");
        }
    };




    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#7ce0f6',
                    boxShadow: 'none',
                    height: 90,
                    justifyContent: 'center',
                    paddingX: 3,
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        px: 2,
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={() => navigate(`/`)}
                        sx={{
                            position: {
                                xs: 'relative',
                                md: 'absolute'
                            },
                            left: {
                                xs: 'auto',
                                md: '10%'
                            },
                            top: {
                                xs: 'auto',
                                md: -30
                            },
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& img': {
                                height: {
                                    xs: 80,
                                    sm: 100,
                                    md: 150,
                                    lg: 200,
                                },
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                            },
                            '& img:hover': {
                                transform: 'scale(1.05)',
                            },
                            mb: {
                                xs: 1,
                                md: 0
                            }
                        }}
                    >
                        <img src="/img/Tasthylogo.png" alt="Tasty Logo" />
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 999,
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            width: 350,
                            height: 60,
                            mx: 'auto',
                        }}
                    >
                        <SearchIcon sx={{ color: 'gray' }} />
                        <InputBase
                            placeholder="Tìm kiếm trong Tasty"
                            sx={{ ml: 1, flex: 1, fontSize: 20 }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Select
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            size="small"
                            variant="standard"
                            disableUnderline
                            sx={{ fontSize: 14, ml: 2, color: 'gray' }}
                        >
                            <MenuItem value="recipes">Món ăn</MenuItem>
                            <MenuItem value="exercises">Bài tập</MenuItem>
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', right: '10%', alignItems: 'flex-end', gap: 2 }}>
                        {!isLoggedIn ? (
                            <Typography
                                onClick={() => navigate('/login')}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: 'white',
                                    fontSize: 25,
                                    border: '1px solid white',
                                    borderRadius: 4,
                                    padding: '4px 12px',
                                    display: 'inline-block',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        textDecoration: 'none',
                                    },
                                }}
                            >
                                Đăng nhập
                            </Typography>
                        ) : (
                            <>

                                <Avatar alt={userName} sx={{ bgcolor: '#0288d1', cursor: 'pointer' }}>
                                    {userName[0].toUpperCase()}
                                </Avatar>
                                <Typography sx={{ fontWeight: 600, fontSize: 25 }}>{userName}</Typography>
                                <IconButton onClick={handleMenuOpen}>
                                    <ExpandMoreIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    PaperProps={{
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 2,
                                            minWidth: 200,
                                            bgcolor: 'background.paper',
                                            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                                            mt: 1,
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                        <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Trang cá nhân" />
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/myfavor'); handleMenuClose(); }}>
                                        <ListItemIcon><FavoriteIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Yêu thích" />
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/selectedrecipe'); handleMenuClose(); }}>
                                        <ListItemIcon><MenuBookIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Thực đơn của tôi" />
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/selectedexercise'); handleMenuClose(); }}>
                                        <ListItemIcon><DirectionsRunIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Bài tập của tôi" />
                                    </MenuItem>
                                    <MenuItem onClick={() => { navigate('/workoutplan'); handleMenuClose(); }}>
                                        <ListItemIcon><EventAvailableOutlinedIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Lịch trình tập luyện " />
                                    </MenuItem>
                                    {userRole === 'Admin' && (
                                        <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                                            <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText primary="Trang quản trị" sx={{ color: 'blue' }} />
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Đăng xuất" sx={{ color: 'red' }} />
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <AppBar
                position="static"
                sx={{
                    backgroundColor: '#e0f7fa',
                    boxShadow: 'none',
                    height: 50,
                    justifyContent: 'center',
                    px: { xs: 1, md: 3 },
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: '50px !important',
                        display: 'flex',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 3, md: 12, lg: 20 },
                        width: '100%',
                    }}
                >
                    <Typography
                        onClick={() => navigate('/')}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 30,
                            color: 'black',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Dinh dưỡng
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: 'pointer' }}
                        onClick={handleOpenSportMenu}
                    >
                        <Typography
                            onClick={() => navigate('/exercise')}
                            sx={{
                                fontWeight: 600,
                                fontSize: 30,
                                color: 'black',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            Thể thao
                        </Typography>
                        <ArrowDropDownIcon sx={{ color: 'black' }} />
                    </Box>

                    <Menu
                        anchorEl={anchorElSport}
                        open={Boolean(anchorElSport)}
                        onClose={handleCloseSportMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        <MenuItem onClick={() => { handleCloseSportMenu(); navigate('/routine'); }}>
                            Lịch trình tập
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

        </>

    );
};

export default Navbar;
