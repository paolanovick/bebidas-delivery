import mongoose from "mongoose";

const configIncentivoSchema = new mongoose.Schema(
  {
    activo: { type: Boolean, default: true },
    montoMinimo: { type: Number, default: 40000 },
    textoTitulo: {
      type: String,
      default: "¡Estás cerca del envío gratis!",
    },
    textoSugerencia: {
      type: String,
      default: "Agregá estos productos:",
    },
    categoriasPermitidas: {
      type: [String],
      default: ["Snacks", "Gaseosas y jugos", "Extras y hielo", "Energizantes"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConfigIncentivo", configIncentivoSchema);