import mongoose from "mongoose";
import Bebida from "../models/Bebida.js";
import dotenv from "dotenv";

dotenv.config();

// Mapeo oficial del cliente
const NORMALIZAR = {
  Gaseosa: "Gaseosas y jugos",
  Gaseosas: "Gaseosas y jugos",
  Jugo: "Gaseosas y jugos",
  Jugos: "Gaseosas y jugos",

  Licores: "Aperitivos y Licores",
  Licor: "Aperitivos y Licores",
  Aperitivos: "Aperitivos y Licores",
  Aperitivo: "Aperitivos y Licores",

  Blancas: "Destilados",
  Whisky: "Destilados",
  Whiskys: "Destilados",
  Whiskeys: "Destilados",
  Vodka: "Destilados",
  Gin: "Destilados",
  Ron: "Destilados",
  Tequila: "Destilados",

  Mayoristas: "Ofertas",
  Mayorista: "Ofertas",

  Regalos: "Snacks",
  "Gift Cards": "Snacks",

  "Wine Club": "Vinos",
  Experiencias: "Vinos",
};

function normalizar(cat) {
  if (!cat) return null;
  return NORMALIZAR[cat] || cat;
}

async function migrar() {
  try {
    console.log("🔄 Conectando a Mongo...");
    await mongoose.connect(process.env.MONGO_URI);

    const bebidas = await Bebida.find();
    console.log(`📦 ${bebidas.length} bebidas encontradas.`);

    for (const b of bebidas) {
      let nuevaCategoria = null;

      // 1) Si existe b.categorias… tomar primera
      if (Array.isArray(b.categorias) && b.categorias.length > 0) {
        nuevaCategoria = normalizar(b.categorias[0]);
      }

      // 2) Si tiene campo "categoria" viejo, usarlo
      if (!nuevaCategoria && b.categoria) {
        nuevaCategoria = normalizar(b.categoria);
      }

      // 3) Si no se puede decidir, forzar "Snacks" o "Sin categoría"
      if (!nuevaCategoria) nuevaCategoria = "Snacks";

      // GUARDAR NUEVO MODELO
      b.categoria = nuevaCategoria;
      b.subcategoria = "";
      b.tipoWhisky = "";

      // ELIMINAR campo viejo
      b.categorias = undefined;

      await b.save();
      console.log(`✔ Migrado: ${b.nombre} → ${nuevaCategoria}`);
    }

    console.log("🎉 Migración completada.");
    process.exit();
  } catch (err) {
    console.error("❌ Error en migración:", err);
    process.exit(1);
  }
}

migrar();
