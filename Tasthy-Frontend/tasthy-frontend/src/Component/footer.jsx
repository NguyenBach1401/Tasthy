import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    IconButton,
    Grid,
} from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: '#1c1c1c', color: 'white', p: 4 }}>
            <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                        <img src="/img/Tasthylogo.png" alt="Tasty Logo" style={{ height: 150 }} />
                    </Box>
                    <Typography fontWeight={600} fontSize={20}>Get the Tasty Newsletter</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }} fontSize={20}>
                        Email address (required)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                            variant="outlined"
                            placeholder="Your email address"
                            size="small"
                            sx={{ backgroundColor: 'white', borderRadius: 1, flex: 1 }}
                        />
                        <Button variant="contained" sx={{ bgcolor: '#ff0050' }}>
                            Sign up
                        </Button>
                    </Box>
                    <Box mt={3}>
                        <Typography fontWeight={600} mb={1} fontSize={20}>
                            Follow Tasthy
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {[Facebook, Twitter, Instagram, YouTube].map((Icon, idx) => (
                                <IconButton
                                    key={idx}
                                    sx={{
                                        border: '1px solid #ff6699',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 65,
                                        height: 65,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 35 }} />
                                </IconButton>
                            ))}
                        </Box>
                        <Typography variant="body2" color="gray" fontSize={20}>
                            © 2025 BACHMINH, Inc
                        </Typography>
                    </Box>
                </Grid>


                <Grid item xs={12} md={6}>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-end',
                        flexDirection: 'column', height: '100%', gap: 1, alignItems: 'flex-end'
                    }}>
                        {[
                            'Send feedback',
                            'Recipes by Ingredient',
                            'Community Recipes',
                            'Privacy Policy',
                            'User Agreement',
                            'Accessibility Statement',
                            'Our Tasty Values',
                            'Advertise with Tasty',
                        ].map((text, idx) => (
                            <Link
                                key={idx}
                                href="#"
                                underline="hover"
                                sx={{ color: '#ff7b9f', fontWeight: 600, fontSize: 20 }}
                            >
                                {text}
                            </Link>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
