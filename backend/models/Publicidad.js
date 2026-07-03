import mongoose from "mongoose";

const PublicidadSchema = new mongoose.Schema(
  {
    imagenUrl: {
      type: String,
      required: false,
      default: null,
    },
    tipo: {
      type: String,
      enum: ["imagen", "formulario_envio_gratis"],
      default: "imagen",
    },
    titulo: {
      type: String,
      default: "GANASTE UN ENVIO GRATIS POR EL GOL DE ARGENTINA",
    },
    subtitulo: {
      type: String,
      default: "Completa tus datos para reclamar tu beneficio.",
    },
    botonTexto: {
      type: String,
      default: "Enviar datos por WhatsApp",
    },
    whatsappNumero: {
      type: String,
      default: "5492494252530",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Publicidad", PublicidadSchema);
