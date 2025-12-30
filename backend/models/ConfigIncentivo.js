import mongoose from "mongoose";

const configIncentivoSchema = new mongoose.Schema(
  {
    textoIncentivo: {
      type: String,
      default: "¡Estás cerca del envío gratis!",
    },
    montoMinimoEnvioGratis: {
      type: Number,
      default: 40000,
    },
    categoriasProductosSugeridos: {
      type: [String],
      default: ["Snacks", "Gaseosas y jugos", "Extras y hielo"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ConfigIncentivo", configIncentivoSchema);