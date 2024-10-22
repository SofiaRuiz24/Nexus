import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.error(`Connection error: ${error.message}`);
        process.exit(1); // Salir con error
    }
};

export default connectDB