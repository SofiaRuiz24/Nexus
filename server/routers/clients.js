import express from 'express'
const router = express.Router()
import { createUser, deleteUser, getCustomers,createProduct, deleteProduct, getProducts,createTransaction, deleteTransaction, getTransactions ,getGeography,getCustomersSHORT, getProductsSHORT, getTransactionsSHORT, searchUser } from '../controllers/clients.js'

router.get('/geography',getGeography)

// ==========================
// Rutas de Usuarios
// ==========================
// Crear usuario
router.post('/users', createUser);
router.get("/searchUser/:email", searchUser);
// Obtener usuarios (solo con rol "user")
router.get('/customers', getCustomers);
router.get('/customersSHORT', getCustomersSHORT);
// Eliminar usuario por ID
router.delete('/users/:id', deleteUser);

// ==========================
// Rutas de Productos
// ==========================
// Crear producto
router.post('/products', createProduct);
// Obtener productos
router.get('/products', getProducts);
router.get('/productsSHORT', getProductsSHORT);
// Eliminar producto por ID
router.delete('/products/:id', deleteProduct);

// ==========================
// Rutas de Transacciones
// ==========================
// Crear transacción
router.post('/transactions', createTransaction);
// Obtener transacciones
router.get('/transactions', getTransactions);
router.get('/transactionsSHORT', getTransactionsSHORT);
// Eliminar transacción por ID
router.delete('/transactions/:id', deleteTransaction);

export default router;