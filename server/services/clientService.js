import User from '../models/User.js';


export const saveClientToDB = async (clientData) => {
  try {
    const newClient = new User({
      nombre: clientData.nombre,
      apellido: clientData.apellido,
      email: clientData.email,
      phone: clientData.phone,
    });

    await newClient.save();
    console.log(`Cliente guardado en la base de datos: ${clientData.nombre} ${clientData.apellido}`);
  } catch (error) {
    console.error("Error guardando el cliente en la base de datos:", error.message);
  }
};
export default saveClientToDB;