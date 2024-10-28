import React, { useState, useMemo } from "react";
import { useTheme, Box, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCustomer, postCustomer } from "lib/apiRequests";

const Customers = () => {
  const theme = useTheme();
  const { isLoading, data, refetch } = useGetCustomersQuery();

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    password: "",
    email: "",
    city: "",
    state: "",
    country: "",
    occupation: "",
    phoneNumber: "",
    role: "user",
  });

  const [search, setSearch] = useState(""); // Estado para la búsqueda

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async () => {
    const response = await postCustomer(newCustomer);
    if (response.status === 201) {
      setNewCustomer({
        name: "",
        password: "",
        email: "",
        city: "",
        state: "",
        country: "",
        occupation: "",
        phoneNumber: "",
        role: "user",
      });
      refetch();
    } else {
      throw new Error("Error al crear customer");
    }
  };

  const handleDeleteCustomer = async (id) => {
    const response = await deleteCustomer(id);
    if (response.status !== 200) throw new Error("Error al borrar customer");
    refetch();
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Nombre", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "phoneNumber",
      headerName: "Teléfono",
      flex: 0.5,
      renderCell: (params) =>
        params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"),
    },
    { field: "country", headerName: "País", flex: 0.4 },
    { field: "occupation", headerName: "Profesión", flex: 1 },
    { field: "role", headerName: "Rol", flex: 0.5 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteCustomer(params.id)}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  // Filtrar los usuarios según el valor de búsqueda
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CLIENTES" subtitle="Lista de clientes" />

      {/* Barra de búsqueda */}
      <TextField
        label="Buscar por nombre"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Formulario para agregar nuevo cliente */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCustomer();
        }}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 4,
          mt: 4,
        }}
      >
        <TextField
          label="Nombre"
          name="name"
          value={newCustomer.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={newCustomer.password}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          value={newCustomer.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Ciudad"
          name="city"
          value={newCustomer.city}
          onChange={handleInputChange}
        />
        <TextField
          label="Estado"
          name="state"
          value={newCustomer.state}
          onChange={handleInputChange}
        />
        <TextField
          label="País"
          name="country"
          value={newCustomer.country}
          onChange={handleInputChange}
        />
        <TextField
          label="Profesión"
          name="occupation"
          value={newCustomer.occupation}
          onChange={handleInputChange}
        />
        <TextField
          label="Teléfono"
          name="phoneNumber"
          value={newCustomer.phoneNumber}
          onChange={handleInputChange}
        />
        <TextField
          label="Rol"
          name="role"
          value={newCustomer.role}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ gridColumn: "span 3" }}
        >
          Agregar Cliente
        </Button>
      </Box>

      {/* Tabla de clientes */}
      <Box mt="40px" height="75vh">
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={filteredData} // Mostrar los datos filtrados
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.primary.light,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Customers;
