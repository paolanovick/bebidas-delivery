// controllers/bebidasController.js
import Bebida from "../models/Bebida.js";

/* =====================================================
   MAPA DE NORMALIZACIÓN OFICIAL DEL CLIENTE
===================================================== */
const MAPA_CATEGORIAS = {
  // GASEOSAS Y JUGOS
  Gaseosas: "Gaseosas y jugos",
  Gaseosa: "Gaseosas y jugos",
  Jugos: "Gaseosas y jugos",
  Jugo: "Gaseosas y jugos",

  // APERITIVOS Y LICORES
  Licores: "Aperitivos y Licores",
  Licor: "Aperitivos y Licores",
  Aperitivos: "Aperitivos y Licores",
  Aperitivo: "Aperitivos y Licores",

  // DESTILADOS
  Blancas: "Destilados",
  Whisky: "Destilados",
  Whiskys: "Destilados",
  Whiskeys: "Destilados",
  Vodka: "Destilados",
  Gin: "Destilados",
  Ron: "Destilados",
  Tequila: "Destilados",

  // OFERTAS
  Mayoristas: "Ofertas",
  Mayorista: "Ofertas",

  // SNACKS
  Regalos: "Snacks",
  "Gift Cards": "Snacks",

  // VINOS
  "Wine Club": "Vinos",
  Experiencias: "Vinos",

  // Las categorías oficiales quedan igual
  Combos: "Combos",
  Cervezas: "Cervezas",
  Vinos: "Vinos",
  "Aperitivos y Licores": "Aperitivos y Licores",
  Destilados: "Destilados",
  "Gaseosas y jugos": "Gaseosas y jugos",
  Energizantes: "Energizantes",
  Snacks: "Snacks",
  Ofertas: "Ofertas",
  Cigarrillos: "Cigarrillos",
};

/* =====================================================
   NORMALIZADOR PRINCIPAL
===================================================== */
function normalizarCategoria(cat) {
  if (!cat) return null;
  return MAPA_CATEGORIAS[cat] || cat;
}

function normalizarCategorias(lista) {
  if (!lista) return [];
  if (!Array.isArray(lista)) lista = [lista];

  const saneadas = lista.map((c) => normalizarCategoria(c)).filter(Boolean);

  return [...new Set(saneadas)];
}

/* =====================================================
   GET /api/bebidas  (corrige productos viejos)
===================================================== */
export const getBebidas = async (req, res) => {
  try {
    const bebidas = await Bebida.find().sort({ creadoEn: -1 });

    const corregidas = bebidas.map((b) => {
      const normalizadas = normalizarCategorias(b.categorias || b.categoria);

      return {
        ...b._doc,
        categorias: normalizadas,
        subcategoria: b.subcategoria || "",
        tipoWhisky: b.tipoWhisky || "",
      };
    });

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
      categoria,
      subcategoria,
      tipoWhisky,
      esEstrella,
    } = req.body;

    const categoriasFinal = normalizarCategorias(categorias || categoria);

    const nuevaBebida = new Bebida({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categorias: categoriasFinal,
      subcategoria: subcategoria || "",
      tipoWhisky: tipoWhisky || "",
      esEstrella: !!esEstrella,
    });

    const guardada = await nuevaBebida.save();
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
      categoria,
      subcategoria,
      tipoWhisky,
      esEstrella,
    } = req.body;

    const categoriasFinal = normalizarCategorias(categorias || categoria);

    const bebidaActualizada = await Bebida.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        categorias: categoriasFinal,
        subcategoria: subcategoria || "",
        tipoWhisky: tipoWhisky || "",
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
    res.json({ mensaje: "Bebida eliminada" });
  } catch (error) {
    console.error("Error al eliminar bebida:", error);
    res.status(400).json({ mensaje: "Error al eliminar bebida" });
  }
};
