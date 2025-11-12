import express from "express";
import Bebida from "../models/Bebida.js";

const router = express.Router();

// ✅ Endpoint para migrar datos una sola vez
router.get("/migrar-categorias", async (req, res) => {
  try {
    const bebidas = await Bebida.find({ categoria: { $exists: true } });

    let migradas = 0;
    for (const bebida of bebidas) {
      if (
        bebida.categoria &&
        (!bebida.categorias || bebida.categorias.length === 0)
      ) {
        bebida.categorias = [bebida.categoria];
        bebida.categoria = undefined;
        await bebida.save();
        migradas++;
      }
    }

    res.json({
      mensaje: `✅ Migración completada. ${migradas} bebidas actualizadas.`,
      migradas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
