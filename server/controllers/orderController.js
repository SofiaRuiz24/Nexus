import Order from '../models/order.js'; // Asegúrate de ajustar la ruta de tu modelo
import sendMessage from '../services/whatsappService.js';  

// Función que maneja el cambio de estado a 'cancelado' y envía un mensaje al usuario
export const handleOrderCancellation = async (orderId) => {
    try {
        // Buscar la orden por su ID
        const order = await Order.findById(orderId).populate('userId');

        if (!order) {
            console.error("Orden no encontrada");
            return;
        }

        // Verificar si el estado es 'cancelado'
        if (order.status === 'cancelado') {
            const user = order.userId;

            if (!user || !user.phoneNumber) {
                console.error("Usuario o número de teléfono no encontrado");
                return;
            }

            // Crear el mensaje profesional
            const message = `Estimado/a ${user.name}, lamentamos informarle que su pedido ha sido cancelado. Para más información o asistencia, por favor póngase en contacto con uno de nuestros operadores llamando al 2615901475. Lamentamos las molestias.`;

            // Enviar el mensaje usando el servicio
            await sendMessage(user.phoneNumber, message);

            console.log('Mensaje de cancelación enviado a:', user.phoneNumber);
        }
    } catch (error) {
        console.error("Error al manejar la cancelación de la orden:", error);
    }
};

// Función que maneja el cambio de estado a 'completado' y envía un mensaje al usuario
export const handleOrderCompletion = async (orderId) => {
    try {
        // Buscar la orden por su ID
        const order = await Order.findById(orderId).populate('userId');

        if (!order) {
            console.error("Orden no encontrada");
            return;
        }

        // Verificar si el estado es 'completado'
        if (order.status === 'completado') {
            const user = order.userId;

            if (!user || !user.phoneNumber) {
                console.error("Usuario o número de teléfono no encontrado");
                return;
            }

            // Crear el mensaje profesional para el estado completado
            const message = `Estimado/a ${user.name}, su pedido ha sido confirmado con éxito. Gracias por confiar en nosotros.Ya puede pasar a retirarlo por nuestro local. Si tiene alguna consulta, no dude en ponerse en contacto con nosotros. ¡Que tenga un excelente día!`;

            // Enviar el mensaje usando el servicio
            await  sendMessage(user.phoneNumber, message);

            console.log('Mensaje de completado enviado a:', user.phoneNumber);
        }
    } catch (error) {
        console.error("Error al manejar la completación de la orden:", error);
    }
};
// Crear una nueva orden
export const createOrder = async (req, res) => {
    try {
        const { userId, products } = req.body;

        if (!userId || !products || products.length === 0) {
            return res.status(400).json({ message: "Faltan datos requeridos: userId o productos." });
        }

        const newOrder = new Order({
            userId,
            products,
            status: 'nuevo',
        });

        await newOrder.save();
        res.status(201).json({ message: "Orden creada con éxito", order: newOrder });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ message: "Error al crear la orden" });
    }
};

// Actualizar una orden
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;  // ID de la orden que se va a actualizar
        const { products, status } = req.body;  // Datos que se van a actualizar

        // Verificar que los productos o el estado se estén proporcionando en el cuerpo de la solicitud
        if (!products && !status) {
            return res.status(400).json({ message: "Debe proporcionar productos o estado para actualizar." });
        }

        // Crear un objeto para almacenar los campos que se desean actualizar
        const updatedFields = {};
        if (products) {
            updatedFields.products = products;
        }
        if (status) {
            updatedFields.status = status;
        }

        // Actualizar la orden en la base de datos
        const updatedOrder = await Order.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
         // Si el estado es 'cancelado', manejar la cancelación
         if (status === 'cancelado') {
            await handleOrderCancellation(updatedOrder._id);  // Disparar el envío del mensaje
        }

        // Si el estado es 'completado', manejar la completación
        if (status === 'completado') {
            await handleOrderCompletion(updatedOrder._id);  // Disparar el envío del mensaje de completado
        }

        res.status(200).json({ message: "Orden actualizada con éxito", order: updatedOrder });
    } catch (error) {
        console.error("Error al actualizar la orden:", error);
        res.status(500).json({ message: "Error al actualizar la orden" });
    }
};

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $addFields: {
                    userName: '$userDetails.name'
                }
            },
            {
                $project: {
                    userDetails: 0 // Excluye el campo userDetails después de extraer el nombre
                }
            },
            {
                $unwind: {
                    path: "$products",
                    preserveNullAndEmptyArrays: true // Preserva órdenes sin productos si las hay
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: 'wp_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true // Maneja productos que podrían no tener detalles
                }
            },
            {
                $addFields: {
                    'products.name': '$productDetails.name'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    userName: { $first: '$userName' },
                    status: { $first: '$status' },
                    createdAt: { $first: '$createdAt' },
                    products: { $push: '$products' }
                }
            }
        ]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "No se encontraron órdenes" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        res.status(500).json({ message: "Error al obtener las órdenes" });
    }
};

// Obtener una orden por ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id).populate('userId');  // Popula el campo userId con los detalles del usuario
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        res.status(500).json({ message: "Error al obtener la orden" });
    }
};

// Eliminar una orden por ID
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        res.status(200).json({ message: "Orden eliminada con éxito" });
    } catch (error) {
        console.error("Error al eliminar la orden:", error);
        res.status(500).json({ message: "Error al eliminar la orden" });
    }
};
