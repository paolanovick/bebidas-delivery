import mongoose from "mongoose";

export const CATEGORIAS_OFICIALES = [
  "Combos",
  "Cervezas",
  "Vinos",
  "Aperitivos y Licores",
  "Destilados",
  "Gaseosas y jugos",
  "Energizantes",
  "Snacks",
  "Ofertas",
  "Cigarrillos",
];

export const SUBCATEGORIAS = {
  Vinos: ["Tinto", "Blanco", "Rosado"],
  Destilados: ["Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  Whisky: ["Bourbon", "Scotch", "Irish"],
};

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },

  // ✔ CATEGORÍA ÚNICA (NUNCA MÁS UN ARRAY)
  // ✔ CATEGORÍAS (ARRAY)
  categorias: {
    type: [String],
    required: true,
    enum: CATEGORIAS_OFICIALES,
  },

  // ✔ SUBCATEGORÍA (solo cuando corresponde)
  subcategoria: {
    type: String,
    default: "",
  },

  // ✔ TIPO DE WHISKY (solo si subcategoria === "Whisky")
  tipoWhisky: {
    type: String,
    default: "",
  },

  esEstrella: {
    type: Boolean,
    default: false,
  },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
