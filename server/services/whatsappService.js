import axios from 'axios';

const sendMessage  = async (to, message) => {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_TEST_NUMBER;

  try {
    await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Mensaje enviado a ${to}: ${message}`);
  } catch (error) {
    console.error(`Error enviando mensaje a ${to}:`, error.response ? error.response.data : error.message);
  }
};
export default sendMessage;