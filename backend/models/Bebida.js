// models/Bebida.js
import mongoose from "mongoose";

/*
-------------------------------------------------------------
 CATEGORÍAS OFICIALES DEL CLIENTE
 (TODO lo que no coincida será normalizado del lado del controller)
-------------------------------------------------------------
*/
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

/*
-------------------------------------------------------------
 SUBCATEGORÍAS OFICIALES
-------------------------------------------------------------
*/
export const SUBCATEGORIAS = {
  Vinos: ["Tinto", "Blanco", "Rosado"],

  Destilados: [
    "Vodka",
    "Gin",
    "Ron",
    "Tequila",
    "Whisky", // Whisky es una subcategoría dentro de Destilados
  ],

  Whisky: ["Bourbon", "Scotch", "Irish"], // Sub–subcategoría
};

const bebidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },

  /*
  -------------------------------------------------------------
   CATEGORÍAS (array, siempre normalizado)
  -------------------------------------------------------------
  */
  categorias: {
    type: [String],
    default: [],
  },

  /*
  -------------------------------------------------------------
   SUBCATEGORÍAS
   - Para vinos: Tinto, Blanco, Rosado
   - Para destilados: Vodka, Gin, Ron, Tequila, Whisky
   - Para whisky: Bourbon, Scotch, Irish
  -------------------------------------------------------------
  */
  subcategoria: {
    type: String,
    default: "",
  },

  /*
  -------------------------------------------------------------
   TIPO de whisky (sub-subcategoría)
   SOLO aplica si subcategoria = "Whisky"
  -------------------------------------------------------------
  */
  tipoWhisky: {
    type: String,
    default: "",
  },

  // Producto destacado
  esEstrella: {
    type: Boolean,
    default: false,
  },

  creadoEn: { type: Date, default: Date.now },
});

export default mongoose.model("Bebida", bebidaSchema);
