import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    styled,
    ListItemButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';

const drawerWidth = 240;

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Các menu item
    const menuItems = [
        { text: 'Quản lý người dùng', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Quản lý thẻ', icon: <LocalOfferIcon />, path: '/admin/tags' },
        { text: "Quản lý các bài tập", icon: <FitnessCenterIcon />, path: '/admin/exercises' },
        { text: "Quản lý công thức món ăn", icon: <RestaurantMenuRoundedIcon />, path: '/admin/recipes' },

        // Thêm menu khác nếu cần
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : 60,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : 60,
                        boxSizing: 'border-box',
                        backgroundColor: '#F5F7F9',
                        color: 'white',
                        overflowX: 'hidden',
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                    },
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: open ? 'space-between' : 'center',
                        px: [1],
                        borderBottom: '1px solid #444',
                    }}
                >
                    {open && (
                        <Box
                            onClick={() => navigate(`/`)}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft: 5 }}>
                            <img
                                src="/img/Tasthylogo.png"
                                alt="Logo"
                                style={{ width: 80, height: 80, borderRadius: 5 }}
                            />
                        </Box>
                    )}
                    <IconButton
                        onClick={toggleDrawer}
                        sx={{ color: 'black' }}
                        aria-label="toggle sidebar"
                        size='30'
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>

                <Divider sx={{ backgroundColor: '#444' }} />

                <List>
                    {menuItems.map(({ text, icon, path }) => {
                        const active = location.pathname === path;
                        return (
                            <ListItem key={text} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={path}
                                    sx={{
                                        color: active ? 'rgba(58, 53, 65, 0.87)' : 'black',
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                        px: 2,
                                    }}
                                >
                                    <ListItemIcon sx={{ color: active ? 'rgba(58, 53, 65, 0.87)' : 'black', minWidth: 36 }}>
                                        {icon}
                                    </ListItemIcon>
                                    {open && <ListItemText primary={text} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
