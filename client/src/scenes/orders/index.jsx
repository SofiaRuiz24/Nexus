import React, { useState, useEffect } from "react";
import { useTheme, Box, Typography, Fab, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useGetOrdersQuery } from "state/api";
import { updateOrder } from "lib/apiRequests";

const Orders = () => {
  const theme = useTheme();
  const { data: ordersData, isLoading: isOrdersLoading, refetch } = useGetOrdersQuery();
  const [currentTicket, setCurrentTicket] = useState(0);

  // Filtrar solo los tickets con status "nuevo"
  const filteredTickets = ordersData?.filter((ticket) => ticket.status === "nuevo") || [];

  // Ajustar el índice del ticket actual si la lista de tickets cambia
  useEffect(() => {
    if (currentTicket >= filteredTickets.length) {
      setCurrentTicket(Math.max(0, filteredTickets.length - 1));
    }
  }, [filteredTickets, currentTicket]);

  const handleNextTicket = () => {
    setCurrentTicket((prev) => (prev + 1) % filteredTickets.length);
  };

  const handlePreviousTicket = () => {
    setCurrentTicket((prev) => (prev - 1 + filteredTickets.length) % filteredTickets.length);
  };

  const handleUpdate = async (_id, status) => {
    const response = await updateOrder(_id, status);
    if (response.status !== 200) {
      alert("Error completando órden, por favor intente nuevamente");
    } else {
      status.status === "completado"
        ? alert("Órden completada correctamente")
        : alert("Órden cancelada correctamente");
      await refetch();
      setCurrentTicket(0);
    }
  };

  if (isOrdersLoading) return <p>Cargando...</p>;
  if (filteredTickets.length === 0) return <p>No hay tickets nuevos.</p>;

  const ticket = filteredTickets[currentTicket];
  const products = ticket.products || [];
  const totalPrice = products.reduce((sum, product) => sum + product.quantity * product.price, 0);

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
        <Typography variant="h6">Usuario: {ticket.userName}</Typography>

        <Box mt={2}>
          <Typography variant="subtitle1">Productos:</Typography>
          {products.length > 0 ? (
            products.map((product, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Typography>{product.name}</Typography>
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

      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        position="absolute"
        bottom={16}
        px={8}
      >
        <Fab color="error" onClick={() => handleUpdate(ticket._id, { status: "cancelado" })}>
          <CloseIcon />
        </Fab>
        <Fab color="success" onClick={() => handleUpdate(ticket._id, { status: "completado" })}>
          <CheckIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default Orders;
