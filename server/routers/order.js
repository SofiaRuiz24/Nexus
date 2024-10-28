import express from 'express';
import {
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
    getAllOrders  // Si quieres una ruta para obtener todas las órdenes
} from '../controllers/orderController.js';  // Asegúrate de ajustar la ruta correctamente

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/create', createOrder);

// Ruta para obtener una orden por ID
router.get('/:id', getOrderById);

// Ruta para actualizar una orden (productos o estado)
router.put('/:id', updateOrder);

// Ruta para eliminar una orden por ID
router.delete('/:id', deleteOrder);

// (Opcional) Ruta para obtener todas las órdenes
router.get('/', getAllOrders);

export default router;