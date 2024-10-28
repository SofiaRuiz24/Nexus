import React,{useState,useEffect} from 'react'
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material'

import { 
    SettingsOutlined, 
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    ReceiptLongOutlined,
    PublicOutlined,
    PointOfSaleOutlined,
    TodayOutlined,
    CalendarMonthOutlined,
    AdminPanelSettingsOutlined,
    TrendingUpOutlined,
    PieChartOutlined,
} from '@mui/icons-material'
import { useLocation,useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'
import ProfileImage from 'assets/profile.jpeg'

const navItems =[
    {
        text:"Panel principal",
        redirection: "dashboard", //Key para redirigir
        icon:<HomeOutlined/>
    },
    {
        text:"Productos",
        redirection: "products",
        icon:<ShoppingCartOutlined/>
    },
    {
        text:"Clientes",
        redirection: "customers",
        icon:<Groups2Outlined/>
    },
    {
        text:"Transacciones",
        redirection: "transactions",
        icon:<ReceiptLongOutlined/>
    },
    {
        text:"Geografía",
        redirection: "geography",
        icon:<PublicOutlined/>
    },
    {
        text:"Ventas",
        icon:null
    },
    {
        text:"Vista general",
        redirection: "overview",
        icon:<PointOfSaleOutlined/>
    },
    {
        text:"Diaramente",
        redirection: "daily",
        icon:<TodayOutlined/>
    },
    {
        text:"Mensualmente",
        redirection: "monthly",
        icon:<CalendarMonthOutlined/>
    },
    {
        text:"Desglose",
        redirection: "breakdown",
        icon:<PieChartOutlined/>
    },
    {
        text:"Administración",
        icon:null
    },
    {
        text:"Admin",
        redirection: "Admin",
        icon:<AdminPanelSettingsOutlined/>
    }
]

const Sidebar = ({
    user,
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile
}) =>{
    const { pathname } = useLocation()
    const [active,setActive] = useState("")
    const navigate = useNavigate()
    const theme = useTheme()

    useEffect(() =>{
        setActive(pathname.substring(1))
    },[pathname])

    return(
    <Box component="nav">
        {
            isSidebarOpen && (
            <Drawer
                open={isSidebarOpen}
                onClose={() =>setIsSidebarOpen(false)}
                variant="persistent"
                anchor="left"
                sx={{
                    width:drawerWidth,
                        "& .MuiDrawer-paper":{
                        color: theme.palette.secondary[200],
                        backgroundColor:theme.palette.background.alt,
                        boxSizing:"border-box",
                        borderWidth:isNonMobile ? 0 : "2px",
                        width:drawerWidth
                    }
                }}
            >
            <Box width="100%">
                <Box m="1.5rem 2rem 2rem 3rem">
                    <FlexBetween color={theme.palette.secondary.main}>
                        <Box display="flex" alignItems="center" gap="0.5rem">
                            <Typography variant="h4" fontWeight="bold">
                                NEXUS HUB
                            </Typography>
                        </Box>
                        {!isNonMobile && (
                            <IconButton onClick ={()=> setIsSidebarOpen(!isSidebarOpen) }>
                                <ChevronLeft/>
                            </IconButton>
                        )
                        }
                    </FlexBetween>
                </Box>
                <List>
                    {
                        navItems.map(({text, redirection, icon}) =>{
                            if(!icon){
                                return(
                                    <Typography key={text} sx={{ m:"2.25rem 0 1rem 3rem" }}>
                                        {text}
                                    </Typography>
                                )
                            }
                            const lcText= redirection.toLowerCase()

                            return (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton onClick={ () =>{navigate(`/${lcText}`)
                                        setActive(lcText)
                                    }}
                                    sx={{ 
                                        backgroundColor:active === lcText ? theme.palette.secondary[300]:"transparent",
                                        color:
                                            active === lcText 
                                            ? theme.palette.primary[600]
                                            : theme.palette.secondary[100]
                                    }}
                                    >
                                        <ListItemIcon
                                            sx={{ 
                                                ml:"2rem",
                                                color:
                                                    active === lcText 
                                                    ? theme.palette.primary[600]
                                                    : theme.palette.secondary[200]
                                            }}
                                        >
                                            {icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                            {active === lcText && (
                                                <ChevronRightOutlined sx={{ ml:"auto" }}/>
                                            )}
                                    </ListItemButton>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Box>
            <Box position="relative" bottom="0.5rem">
                <Divider/>
                <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                    <Box
                        component="img"
                        alt="profile"
                        src={ProfileImage}
                        height="40px"
                        width="40px"
                        borderRadius="50%"
                        sx={{ objectFit:"cover" }}
                    />
                    <Box textAlign="left">
                        <Typography fontWeight="bold" fontSize="0.9rem" sx={{ color: theme.palette.secondary[100] }}>{user.name}</Typography>
                        <Typography fontWeight="bold" fontSize="0.8rem" sx={{ color: theme.palette.secondary[200] }}>{user.occupation}</Typography>
                    </Box>
                    <SettingsOutlined sx={{ color: theme.palette.secondary[300], fontSize:"25px" }}/>
                </FlexBetween>
            </Box>            
        </Drawer>
        )}
    </Box>
    )
}

export default Sidebar