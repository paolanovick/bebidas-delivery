import mongoose from "mongoose";

export const CATEGORIAS_OFICIALES = [
  "Combos",
  "Cervezas",
  "Vinos",
  "Espumantes", // ✅ AGREGAR
  "Aperitivos y Licores",
  "Destilados",
  "Gaseosas y jugos",
  "Energizantes",
  "Snacks",
  "Extras y hielo", // ✅ AGREGAR
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

  categorias: {
    type: [String],
    required: true,
    enum: CATEGORIAS_OFICIALES,
  },

  subcategoria: {
    type: String,
    default: "",
  },

  tipoWhisky: {
    type: String,
    default: "",
  },

  esEstrella: {
    type: Boolean,
    default: false,
  },

  // ✅ NUEVO CAMPO ORDEN
  orden: {
    type: Number,
    default: null,
    min: 1,
    max: 10,
  },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
