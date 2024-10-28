import sendMessage from '../services/whatsappService.js';  // Importación por defecto
import sendMessageTemplate from '../services/sendMessageTemplate.js'
import markMessageAsRead from '../services/markMessageAsRead.js';
//import sendCatalogTemplate from '../services/sendCatalogTemplate.js'
import User from '../models/User.js';  // Importa el modelo User
import Order from '../models/order.js';  // Importa el modelo Order
import { saveClientToDB } from '../services/clientService.js';  // Función para guardar cliente en BD


// Verificación del Webhook
export const verifyWebhook = (req, res) => {
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN; // Configura esto en tu .env
  
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log("Webhook verificado correctamente");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
};
// Función para esperar un número de milisegundos antes de continuar
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
// Almacena los números que están esperando información adicional
const awaitingInfoUsers = {};

// Función de menú de atención
const menuAtencion = async (user,from) => {
  const mensajeMenu = `¿En qué podemos ayudarte? 
1. Información del negocio
2. Hacer un presupuesto
3. Contactar con un agente
4. Salir`;

  sendMessage(from, mensajeMenu);
  user.state = 'menu';
  await User.findByIdAndUpdate(user._id, { state: 'menu' }, { new: true });
};

// Función para atención según la opción seleccionada
const atencion = async (user,from, option) => {
  let respuesta = '';
  switch (option) {
      case '1':
          respuesta = 'Nuestra empresa ofrece los mejores productos eléctricos. Estamos ubicados en Pizurno 231 de Godoy Cruz, Mendoza y puedes visitarnos de lunes a viernes de 9 a 17hs o sábados de 9 a 14hs.';
          sendMessage(from, respuesta);
          await delay(4000);
          menuAtencion(user,from);
          break;
      case '2':
          respuesta = 'Para hacer un presupuesto, por favor indícanos qué productos te interesan en la tienda y agrégalos al carrito de compras. Selecciona finalizar y enviar cuando hayas acabado.';
          sendMessage(from, respuesta);
          //sendCatalogTemplate(from, "catalogo_productos")
          await delay(4000);
          break;
      case '3':
          respuesta = 'Para comunicarse con un agente de atención, envíe un mensaje al 2616901475. Gracias por tu paciencia.';
          sendMessage(from, respuesta);
          await delay(4000);
          menuAtencion(user,from);
          break;
      case '4':
        respuesta = 'Esperamos haber sido de ayuda, ante cualquier otra consulta, comuniquese nuevamente.';
        sendMessage(from, respuesta);
        await delay(4000);
        user.state = 'conectado';
        await user.save();
          break;
      default:
          respuesta = 'Por favor selecciona una opción válida (1, 2, 3 o 4).';
  }
  
  
};

// Función para generar la orden y guardarla en la base de datos
const generarOrden = async (user, productos) => {
  try {
      // Crear una nueva orden en la base de datos
      const nuevaOrden = new Order({
          userId: user._id,  // ID del usuario desde el objeto `user`
          status: 'nuevo',   // Estado inicial de la orden
          products: productos.map((item) => ({
              productId: item.product_retailer_id,
              quantity: item.quantity,
              price: item.item_price,
          })),
      });

      await nuevaOrden.save();  // Guardar la orden en la base de datos
      console.log("Orden generada y guardada en la base de datos:", nuevaOrden);

  } catch (error) {
      console.error("Error al generar la orden:", error);
  }
};

// Manejo de Mensajes de Webhook
export const handleWebhook = async (req, res) => {
    
  const body = req.body;
  try {
    //res.status(200).send('EVENT_RECEIVED');
  if (body.object) {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      const message = change?.messages?.[0];

      if (message) {
          const from = message.from;  // Número de teléfono
          
          if(message.type === 'text'){
          const text = message.text?.body.toLowerCase();  // Texto del mensaje
          console.log("Mensaje recibido:", message);

          // Verificar si el número ya está esperando información
          if (!awaitingInfoUsers[from]) {
              // Verificar si está en la base de datos
              let user = await User.findOne({ phoneNumber: from });

              if (!user) {
                  // Si no está registrado, enviar la plantilla de bienvenida y marcar como esperando info
                  sendMessageTemplate(from, "mensaje_bienvenida");
                  awaitingInfoUsers[from] = true;
              } else {
                
                  if (user.state === 'conectado') {
                    // Si el usuario ya está registrado, enviar un saludo profesional y revisar estado
                      sendMessage(from, `Hola ${user.name}, ¿en qué podemos ayudarte hoy?`);
                      // Enviar menú y cambiar el estado a 'menu'
                      menuAtencion(user,from);
                      
                      await user.save();
                  } else if (user.state === 'menu') {
                      // Procesar opción seleccionada y cambiar a estado 'atencion'
                      const option = text.trim();
                      if (['1', '2', '3', '4'].includes(option)) {
                          atencion(user,from, option);
                          user.state = 'atencion';  // Cambiar estado a 'atencion'
                          await user.save();
                      } else {
                          sendMessage(from, 'Por favor, selecciona una opción válida (1, 2, 3 o 4).');
                      }
                  } else if (user.state === 'atencion') {
                      // Lógica para cuando el usuario ya está en el estado de atención
                      menuAtencion(user,from);// TO DO
                  }
                  res.status(200).send('EVENT_RECEIVED');
                  return;
              }
          } else {
              // Si ya está esperando información adicional
              const clientInfo = text.split(" ");
              
              if (clientInfo.length >= 2) {
                  const [name, apellido, email] = clientInfo;
                  const fullName = `${name} ${apellido}`;  // Concatenar nombre y apellido con un espacio
  
                  // Verificar si el correo tiene formato correcto (validación básica)
                  const emailRegex = /\S+@\S+\.\S+/;
                  if (emailRegex.test(email)) {
                      // Guardar el nuevo usuario en la base de datos
                      const newUser = new User({ phoneNumber: from, name: fullName, email, state: 'conectado'});
                      await newUser.save();

                      // Confirmar registro al usuario
                      sendMessage(from, "Gracias, te hemos registrado como cliente.");
                      await delay(4000);  // Espera de 2 segundos (2000 milisegundos)
                      menuAtencion(newUser,from);
                      delete awaitingInfoUsers[from];  // Eliminar el usuario de la lista de espera
                  } else {
                      // Si el formato del correo es incorrecto
                      sendMessage(from, "Por favor, envía un correo válido.");
                  }
              } else {
                  // Si no envió nombre y correo correctamente
                  sendMessage(from, "Por favor, envía tu nombre y correo en un solo mensaje.");
              }
          }

          return res.status(200).send('EVENT_RECEIVED');
          return;
          }else if(message.type === 'order'){
            res.status(200).send('Tipo de mensaje no reconocido');
            //markMessageAsRead(from,message._id)
            const text = message.text?.body.toLowerCase();  // Texto del mensaje
            console.log("Mensaje recibido:", message);
            // Imprimir el contenido del mensaje de tipo order en formato JSON legible
            console.log("Detalles de la orden recibida:", JSON.stringify(message.order, null, 2));
            // Obtener los productos desde el mensaje
              const productos = message.order?.product_items;

              if (productos && productos.length > 0) {
                  // Buscar al usuario en la base de datos (debería estar registrado previamente)
                  let user = await User.findOne({ phoneNumber: from });

                  if (user) {
                      // Generar la orden y guardarla en la base de datos
                      await generarOrden(user, productos);

                      // Confirmar la recepción de la orden al usuario
                      sendMessage(from, "Tu orden ha sido recibida y estamos procesando tu solicitud.");
                  } else {
                      sendMessage(from, "No hemos podido encontrar tu información. Por favor, regístrate antes de hacer una orden.");
                  }
              } else {
                  console.log("No se encontraron productos en el mensaje de orden.");
                  sendMessage(from, "No se encontraron productos en tu orden. Por favor, revisa e intenta nuevamente.");
              }
          }else{
            console.log('Error en encontrar el type del mensaje recibido.')
            res.status(200).send('Tipo de mensaje no reconocido');
                    return;
          }
                
          } else {
            res.status(200).send('Tipo de mensaje no reconocido');
            return;
          }
        }
    } catch (error) {
          console.error("Error al manejar el webhook:", error);
          return res.status(500).send('Internal Server Error');
    }
};