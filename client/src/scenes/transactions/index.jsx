import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useTheme, TextField, Button } from '@mui/material';
import { useGetTransactionsQuery } from 'state/api';
import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import DeleteIcon from '@mui/icons-material/Delete';

const Transactions = () => {
  const theme = useTheme();

  // Valores enviados al backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const [newTransaction, setNewTransaction] = useState({
    userId: '',
    cost: '',
    products: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = () => {
    console.log('Nueva transacción:', newTransaction);
    // Aquí puedes enviar los datos al backend para agregar la transacción.
    setNewTransaction({
      userId: '',
      cost: '',
      products: '',
    });
  };

  const handleDeleteTransaction = (id) => {
    console.log('Eliminar transacción con ID:', id);
    // Aquí puedes enviar la solicitud al backend para eliminar la transacción.
  };

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'userId', headerName: 'ID de Usuario', flex: 1 },
    { field: 'createdAt', headerName: 'Creado en', flex: 1 },
    {
      field: 'products',
      headerName: '# de Productos',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: 'cost',
      headerName: 'Precio',
      flex: 1,
      sortable: false,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {handleDeleteTransaction()}}
        >
          <DeleteIcon/>
        </Button>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACCIONES" subtitle="Lista de transacciones" />

      {/* Formulario para agregar nueva transacción */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTransaction();
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          label="ID de Usuario"
          name="userId"
          value={newTransaction.userId}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Costo"
          name="cost"
          type="number"
          value={newTransaction.cost}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Productos (ID)"
          name="products"
          value={newTransaction.products}
          onChange={handleInputChange}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ gridColumn: 'span 3' }}
        >
          Agregar Transacción
        </Button>
      </Box>

      {/* Tabla de transacciones */}
      <Box
        mt="40px"
        height="80vh"
        sx={{
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-cell': { borderBottom: 'none' },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          pageSizeOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
