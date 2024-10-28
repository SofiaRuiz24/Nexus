import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'nuevo', enum: ['nuevo', 'procesando', 'completado', 'cancelado'] },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number },
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
