import mongoose from "mongoose";

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },

  // ✅ AHORA ES UN ARRAY para selección múltiple
  categorias: {
    type: [String],
    default: [],
  },

  // ✅ SUBCATEGORÍA para vinos (Blanco, Rosé, Tinto)
  subcategoria: {
    type: String,
    default: "",
  },

  // ✅ PRODUCTO ESTRELLA
  esEstrella: {
    type: Boolean,
    default: false,
  },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
