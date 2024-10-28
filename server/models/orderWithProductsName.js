// models/OrderWithProductsName.js
import mongoose from 'mongoose';

// Definir un esquema incluyendo userId
const orderWithProductsNameSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Asegúrate de que 'User' sea el modelo correcto
    // Otros campos de la vista se manejarán como un objeto
}, { strict: false });

// Crear el modelo especificando que se refiere a la vista
const OrderWithProductsName = mongoose.model('OrderWithProductsName', orderWithProductsNameSchema, 'order_with_products_name');

export default OrderWithProductsName;
