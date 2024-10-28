import express from 'express';
import { verifyWebhook, handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Ruta de verificación de webhook
router.get('/', verifyWebhook);

// Ruta para recibir mensajes
router.post('/', handleWebhook);

export default router;