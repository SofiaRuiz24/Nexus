import React, { useState } from 'react';
import { 
    LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, 
    Search, SettingsOutlined, ArrowDropDownOutlined 
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import ProfileImage from 'assets/profile.jpeg';
import { AppBar, Toolbar, useTheme, InputBase, 
         IconButton, Button, Box, Typography, 
         Menu, MenuItem } from '@mui/material';
import { auth } from 'firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = async () => {
        setAnchorEl(null);
        try {
            await signOut(auth);
            navigate("/auth");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <AppBar sx={{ position: "static", background: "none", boxShadow: "none" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* LEFT SIDE */}
                <FlexBetween>
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <FlexBetween
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="9px"
                        gap="3rem"
                        p="0.1rem 1.5rem"
                    >
                        <InputBase placeholder="Buscar..." />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                </FlexBetween>

                {/* RIGHT SIDE */}
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlined sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightModeOutlined sx={{ fontSize: "25px" }} />
                        )}
                    </IconButton>
                    <IconButton>
                        <SettingsOutlined sx={{ fontSize: "25px" }} />
                    </IconButton>
                    <FlexBetween>
                        <Button
                            onClick={handleClick}
                            sx={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center", 
                                textTransform: "none", 
                                gap: "1rem" 
                            }}
                        >
                            <Box
                                component="img"
                                alt="profile"
                                src={ProfileImage}
                                height="40px"
                                width="40px"
                                borderRadius="50%"
                                sx={{ objectFit: "cover" }}
                            />
                            <Box textAlign="left">
                                <Typography fontWeight="bold" fontSize="0.85rem" sx={{ color: theme.palette.secondary[100] }}>
                                    {user?.name || "Usuario"}
                                </Typography>
                                <Typography fontWeight="bold" fontSize="0.75rem" sx={{ color: theme.palette.secondary[200] }}>
                                    {user?.occupation || "Ocupación"}
                                </Typography>
                            </Box>
                            <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={isOpen}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        >
                            <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
                        </Menu>
                    </FlexBetween>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
