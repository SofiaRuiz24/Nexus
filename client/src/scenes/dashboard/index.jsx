import React from 'react'
import { DownloadOutlined,Email,PointOfSale,PersonAdd, Traffic } from '@mui/icons-material'
import { Box,Typography,Button,useTheme,useMediaQuery } from '@mui/material'
import {DataGrid} from '@mui/x-data-grid'
import BreakdownChart from 'components/BreakdownChart'
import OverviewChart from 'components/OverviewChart'
import StatBox from 'components/StatBox'
import Header from 'components/Header'
import FlexBetween from 'components/FlexBetween'
import { useGetDashboardQuery } from 'state/api'

const Dashboard = () =>{
    const theme = useTheme()
    const isNonMediumScreens = useMediaQuery("(min-width:1200px)")
    const { data,isLoading } = useGetDashboardQuery()

    const columns = [
        {
            field:"_id",
            headerName:"ID",
            flex:1
        },
        {
            field:"userId",
            headerName:"ID de usuario",
            flex:1
        },
        {
            field:"createdAt",
            headerName:"Creado en",
            flex:1
        },
        {
            field:"products",
            headerName:"# de Productos",
            flex:0.5,
            sortable:false,
            renderCell: (params) => params.value.length
        },
        {
            field:"cost",
            headerName:"Precio",
            flex:1,
            sortable:false,
            renderCell: (params) => `$${Number(params.value).toFixed(2)}`
        },
    ]
    return(
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="Panel principal" subtitle="Bienvenido al panel de administración"/>
                <Box>
                    <Button
                        sx={{
                            backgroundColor:theme.palette.secondary.light,
                            color:theme.palette.background.alt,
                            fontSize:"14px",
                            fontWeight:"bold",
                            padding:"10px 20px"
                        }}
                    >
                        <DownloadOutlined sx={{ mr: "10px" }} />
                        Descargar presupuesto
                    </Button>
                </Box>
            </FlexBetween>
            <Box
                mt="20px"
                display="grid"
                gridTemplateColumns="repeat(12,1fr)"
                gridAutoRows="160px"
                gap="20px"
                sx={{
                    "& > div": {gridColumn: isNonMediumScreens ? undefined : "span 12"}
                }}
            >
                <StatBox 
                    title="Clientes totales"
                    value={ data && data.totalCustomers }
                    increase="+14%"
                    description="Desde el mes pasado"
                    icon={
                        <Email sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
                    }
                />

                <StatBox 
                    title="Ventas del día"
                    value={ data && data.todayStats.totalSales }
                    increase="+21%"
                    description="Desde el mes pasado"
                    icon={
                        <PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
                    }
                />
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    backgroundColor={theme.palette.background.alt}
                    p="1rem"
                    borderRadius="0.55rem"
                >
                    <OverviewChart view="sales" isDashboard={true}/>
                </Box>
                <StatBox 
                    title="Ventas mensuales"
                    value={ data && data.thisMonthStats.totalSales }
                    increase="+5%"
                    description="Desde el mes pasado"
                    icon={
                        <PersonAdd sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
                    }
                />
                <StatBox 
                    title="Ventas anuales"
                    value={ data && data.yearlySalesTotal }
                    increase="+43%"
                    description="Desde el año pasado"
                    icon={
                        <Traffic sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />
                    }
                />
                <Box
                    gridColumn="span 8"
                    gridRow="span 3"
                    sx={{
                        "& .MuiDataGrid-root":{
                            border:"none"
                        },
                        "& .MuiDataGrid-cell":{
                            borderBottom:"none"
                        },
                        "& .MuiDataGrid-columnHeaders":{
                            backgroundColor:theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderBottom: "none"
                        },
                        "& .MuiDataGrid-virtualScroller":{
                            backgroundColor:theme.palette.primary.light
                        },
                        "& .MuiDataGrid-footerContainer":{
                            backgroundColor:theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderTop:"none"
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text":{
                            color: `${theme.palette.secondary[200]} !important`
                        }
                       }}
                >
                    <DataGrid
                        loading={isLoading || !data}
                        getRowId={(row) => row._id}
                        rows={(data && data.transactions) || []}
                        columns={columns}
                    />
                </Box>
                <Box
                    gridColumn='span 4'
                    gridRow='span 3'
                    background={theme.palette.background.alt}
                    p='1.5rem'
                    borderRadius='0.55rem'
                >
                    <Typography variant='h6' sx={{ color: theme.palette.secondary[100] }}>
                       Venta por categoría
                    </Typography>
                    <BreakdownChart isDashboard={true}/>
                    <Typography p='0 0.6rem' fontSize='0.8rem' sx={{ color:theme.palette.secondary[200]}}>
                        Desglose e información por categoría de ingresos obtenidos este año
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Dashboard