import mongoose from "mongoose";
import { invalidarBebidasCache } from "../helpers/bebidasCache.js";

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


esIncentivo: {
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

// Cualquier cambio de bebidas o de stock (ABM, pedidos, cancelaciones,
// migraciones) descarta el catálogo cacheado de GET /api/bebidas.
bebidaSchema.post("save", invalidarBebidasCache);
bebidaSchema.post(
  ["findOneAndUpdate", "findOneAndDelete", "findOneAndReplace", "updateOne", "updateMany", "deleteOne", "deleteMany", "replaceOne"],
  { document: false, query: true },
  invalidarBebidasCache
);
bebidaSchema.post("deleteOne", { document: true, query: false }, invalidarBebidasCache);
bebidaSchema.post("insertMany", invalidarBebidasCache);
bebidaSchema.post("bulkWrite", invalidarBebidasCache);

export default mongoose.model("Bebida", bebidaSchema);
