// controllers/bebidasController.js
import Bebida from "../models/Bebida.js";

/* ============================
   GET /api/bebidas
============================ */
export const getBebidas = async (req, res) => {
  try {
    const bebidas = await Bebida.find().sort({ creadoEn: -1 });
    res.json(bebidas);
  } catch (error) {
    console.error("Error al obtener bebidas:", error);
    res.status(500).json({ mensaje: "Error al obtener bebidas" });
  }
};

/* ======================================================
   FUNCIÓN AUXILIAR — NORMALIZA TODAS LAS CATEGORÍAS
====================================================== */
const normalizarCategorias = (categorias, categoria) => {
  // Si viene array válido → usarlo
  if (Array.isArray(categorias) && categorias.length > 0) {
    return categorias.map((c) => String(c).trim());
  }

  // Si viene una sola categoría → convertirlo a array
  if (categoria && typeof categoria === "string") {
    return [categoria.trim()];
  }

  return [];
};

/* ============================
   POST /api/bebidas
============================ */
export const agregarBebida = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias,
      categoria,
      subcategoria,
      esEstrella,
    } = req.body;

    const categoriasNormalizadas = normalizarCategorias(categorias, categoria);

    const nuevaBebida = new Bebida({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias: categoriasNormalizadas,
      subcategoria: subcategoria || "",
      esEstrella: !!esEstrella,
    });

    const guardada = await nuevaBebida.save();
    res.json(guardada);
  } catch (error) {
    console.error("Error al agregar bebida:", error);
    res.status(500).json({ error: "Error al agregar bebida" });
  }
};

/* ============================
   PUT /api/bebidas/:id
============================ */
export const editarBebida = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias,
      categoria,
      subcategoria,
      esEstrella,
    } = req.body;

    const categoriasNormalizadas = normalizarCategorias(categorias, categoria);

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
        esEstrella: !!esEstrella,
      },
      { new: true, runValidators: true }
    );

    if (!bebidaActualizada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }

    res.json(bebidaActualizada);
  } catch (error) {
    console.error("Error al actualizar bebida:", error);
    res.status(400).json({ mensaje: "Error al actualizar bebida" });
  }
};

/* ============================
   DELETE /api/bebidas/:id
============================ */
export const eliminarBebida = async (req, res) => {
  const { id } = req.params;

  try {
    const bebidaEliminada = await Bebida.findByIdAndDelete(id);
    if (!bebidaEliminada) {
      return res.status(404).json({ mensaje: "Bebida no encontrada" });
    }

    res.json({ mensaje: "Bebida eliminada" });
  } catch (error) {
    console.error("Error al eliminar bebida:", error);
    res.status(400).json({ mensaje: "Error al eliminar bebida" });
  }
};
