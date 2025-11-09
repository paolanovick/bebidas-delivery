import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, default: "cliente" }, // cliente o admin
  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Usuario", usuarioSchema, "usuarios");

