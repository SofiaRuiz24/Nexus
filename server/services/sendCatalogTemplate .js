import axios from 'axios';

const sendCatalogTemplate = async (to, templateName) => {
    const token = process.env.WHATSAPP_API_TOKEN;  // Token de autenticación desde .env
    const phoneNumberId = process.env.WHATSAPP_TEST_NUMBER;  // ID del número de WhatsApp

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages_templates`,
            {
                messaging_product: "whatsapp",
                to: to,  // Número de destinatario en formato internacional
                type: "template",
                template: {
                    name: template,
                    language: {
                        code: "es_AR"
                    }                    
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        console.log(`Plantilla de catálogo enviada a ${to}`);
        return response.data;
    } catch (error) {
        console.error(`Error enviando la plantilla de catálogo a ${to}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};
export default sendCatalogTemplate;