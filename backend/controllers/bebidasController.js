// controllers/bebidasController.js
import Bebida from "../models/Bebida.js";
import { CATEGORIAS_OFICIALES, SUBCATEGORIAS } from "../models/Bebida.js";

/* =====================================================
   NORMALIZADOR DE CATEGORÍA (para productos viejos)
===================================================== */
const MAPA_CATEGORIAS = {
  Gaseosa: "Gaseosas y jugos",
  Gaseosas: "Gaseosas y jugos",
  Jugos: "Gaseosas y jugos",
  Jugo: "Gaseosas y jugos",

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

/* -----------------------------------------------------
 Normaliza categoría antigua -> categoría oficial
----------------------------------------------------- */
function normalizarCategoria(cat) {
  if (!cat) return null;
  return MAPA_CATEGORIAS[cat] || cat;
}

/* =====================================================
   GET /api/bebidas
===================================================== */
export const getBebidas = async (req, res) => {
  try {
    const bebidas = await Bebida.find().sort({ creadoEn: -1 });

    const corregidas = bebidas.map((b) => ({
      ...b._doc,
      categoria: normalizarCategoria(b.categoria) || "Sin categoría",
      subcategoria: b.subcategoria || "",
      tipoWhisky: b.tipoWhisky || "",
    }));

    res.json(corregidas);
  } catch (error) {
    console.error("Error al obtener bebidas:", error);
    res.status(500).json({ mensaje: "Error al obtener bebidas" });
  }
};

/* =====================================================
   POST /api/bebidas
===================================================== */
export const agregarBebida = async (req, res) => {
  try {
    let {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias,
      subcategoria,
      tipoWhisky,
      esEstrella,
    } = req.body;

    // Normalizar categorías
    const categoriasNormalizadas = (categorias || []).map((cat) =>
      normalizarCategoria(cat)
    );

    const nueva = new Bebida({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias: categoriasNormalizadas,
      subcategoria: subcategoria || "",
      tipoWhisky: tipoWhisky || "",
      esEstrella: !!esEstrella,
    });

    const guardada = await nueva.save();
    res.json(guardada);
  } catch (error) {
    console.error("Error al agregar bebida:", error);
    res.status(500).json({ error: "Error al agregar bebida" });
  }
};
/* =====================================================
   PUT /api/bebidas/:id
===================================================== */
export const editarBebida = async (req, res) => {
  const { id } = req.params;

  try {
    let {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias,
      subcategoria,
      tipoWhisky,
      esEstrella,
    } = req.body;

    // Normalizar categorías
    const categoriasNormalizadas = (categorias || []).map((cat) =>
      normalizarCategoria(cat)
    );

    const bebidaActualizada = await Bebida.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        categorias: categoriasNormalizadas,
        subcategoria: subcategoria || "",
        tipoWhisky: tipoWhisky || "",
        esEstrella: !!esEstrella,
      },
      { new: true }
    );

    if (!bebidaActualizada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }

    res.json(bebidaActualizada);
  } catch (error) {
    console.error("Error al actualizar bebida:", error);
    res.status(500).json({ mensaje: "Error al actualizar bebida" });
  }
};

/* =====================================================
   DELETE /api/bebidas/:id
===================================================== */
export const eliminarBebida = async (req, res) => {
  const { id } = req.params;

  try {
    const bebidaEliminada = await Bebida.findByIdAndDelete(id);

    if (!bebidaEliminada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }

    res.json({ mensaje: "Bebida eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar bebida:", error);
    res.status(500).json({ mensaje: "Error al eliminar bebida" });
  }
};
