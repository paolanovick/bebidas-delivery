import mongoose from "mongoose";

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },

  /* ============================================
     CATEGORÍAS — múltiple selección (array)
     Mantiene compatibilidad con datos viejos
  ============================================ */
  categorias: {
    type: [String],
    default: [],
  },

  /* ============================================
     SUBCATEGORÍAS — depende de la categoría
     Whisky: Bourbon | Scotch | Irish
     Destilados: Vodka | Gin | Ron | Tequila
     Vinos: Tinto | Blanco | Rosé
  ============================================ */
  subcategoria: {
    type: String,
    default: "",
  },

  /* ============================================
     PRODUCTO ESTRELLA
  ============================================ */
  esEstrella: {
    type: Boolean,
    default: false,
  },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
