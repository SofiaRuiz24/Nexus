import React, { useState } from "react";
import { useTheme, Box, Typography, Fab, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGetCustomersQuery, useGetOrdersQuery, useGetProductsQuery } from "state/api";

const Orders = () => {
  const theme = useTheme();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrdersQuery();
  const { data: productsData, isLoading: isProductsLoading, error, refetch } = useGetProductsQuery();
  const { data: customersData, isLoading: isCustomersLoading } = useGetCustomersQuery();

  const [currentTicket, setCurrentTicket] = useState(0); // Estado del ticket actual

  // Cambiar al siguiente o al anterior ticket
  const handleNextTicket = () => {
    setCurrentTicket((prev) => (prev + 1) % ordersData.length);
  };

  const handlePreviousTicket = () => {
    setCurrentTicket((prev) => (prev - 1 + ordersData.length) % ordersData.length);
  };

  // Aceptar y rechazar ticket
  const handleAccept = () => {
    console.log(`Ticket ${currentTicket + 1} aceptado`);
    handleNextTicket();
  };

  const handleReject = () => {
    console.log(`Ticket ${currentTicket + 1} rechazado`);
    handleNextTicket();
  };

  if (isOrdersLoading || !ordersData) return <p>Cargando...</p>;

  const ticket = ordersData[currentTicket];
  console.log(ticket.userId)
  const products = ticket.products || [];
  const totalPrice = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  //Función para obtener el nombre del usuario según el userId
  const getUserNameById = (userId) => {
    if(isCustomersLoading) return
    const user = customersData.find(customer => userId === customer._id);
    return user ? user.name : `Usuario ${currentTicket + 1}`;
  };

  const getProductNameById = async (product_id) => {
    console.log(product_id)
    const product = await productsData.find(product => product.wp_id === product_id)
    return product
  }

  return (
    <Box
      m="1.5rem 2.5rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      height="90vh"
    >
      <Typography variant="h4" gutterBottom>
        Ticket #{currentTicket + 1}
      </Typography>

      <Box
        width="300px"
        p={2}
        border={`1px solid ${theme.palette.primary.main}`}
        borderRadius="8px"
        mb={2}
      >
        <Typography variant="h6">Usuario: {getUserNameById(ticket.userId)}</Typography> {/* Muestra el nombre del usuario aquí */}

        <Box mt={2}>
          <Typography variant="subtitle1">Productos:</Typography>
          {products.length > 0 ? (
            products.map((product, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Typography>{}</Typography> {/* Muestra el nombre del usuario de cada producto */}
                <Typography>
                  {product.quantity} x ${product.price}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No hay productos</Typography>
          )}
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* Flechas laterales para navegar */}
      <IconButton
        onClick={handlePreviousTicket}
        sx={{ position: "absolute", top: "50%", left: 16 }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton
        onClick={handleNextTicket}
        sx={{ position: "absolute", top: "50%", right: 16 }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Botones flotantes para aceptar y rechazar */}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        position="absolute"
        bottom={16}
        px={8}
      >
        <Fab color="error" onClick={handleReject}>
          <CloseIcon />
        </Fab>
        <Fab color="success" onClick={handleAccept}>
          <CheckIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default Orders;
