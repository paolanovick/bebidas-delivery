import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  rol: { type: String, default: "cliente" }, // cliente o admin
  creadoEn: { type: Date, default: Date.now },
});

// ✅ Método para verificar contraseña
usuarioSchema.methods.comprobarPassword = function (contrasenaFormulario) {
  return bcrypt.compare(contrasenaFormulario, this.contrasena);
};

export default mongoose.model("Usuario", usuarioSchema, "usuarios");
