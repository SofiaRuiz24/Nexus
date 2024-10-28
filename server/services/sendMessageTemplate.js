import axios from 'axios';

const sendMessageTemplate = async (to, templateName) => {
    try {
        const body = {
            "messaging_product": "whatsapp",
            "to": to,  // Número de teléfono del destinatario
            "type": "template",
            "template": {
                "name": templateName,  // Nombre de la plantilla
                "language": {
                    "code": "es_AR"  // Código de idioma (Argentina)
                }
            }
        };

        // Llamada a la API de WhatsApp con Axios
        const response = await axios.post(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_TEST_NUMBER}/messages`, body, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,  // Token de acceso de la API
                'Content-Type': 'application/json'
            }
        });

        console.log('Mensaje enviado:', response.data);
    } catch (error) {
        console.error('Error enviando el mensaje de plantilla:', error);
    }
};
export default sendMessageTemplate;