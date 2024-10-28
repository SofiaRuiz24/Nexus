import axios from 'axios';

const markMessageAsRead = async (to,messageId) => {
  try {
    const response = await axios.post(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_TEST_NUMBER}/messages`, {
        to: to,
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`, // El token de acceso que obtuviste de la API de Facebook/WhatsApp
        'Content-Type': 'application/json'
      }
    });

    console.log('Mensaje marcado como leído:', response.data);
  } catch (error) {
    console.error('Error al marcar el mensaje como leído:', error.response?.data || error.message);
  }
};

export default markMessageAsRead;