import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${connection.connection.host}`);
  } catch (error) {
    console.log("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

export default conectarDB;
