import express from "express";
import Bebida from "../models/Bebida.js";

const router = express.Router();

// ✅ Endpoint para migrar datos una sola vez
router.get("/migrar-categorias", async (req, res) => {
  try {
    const result = await Bebida.updateMany(
      { categoria: { $exists: true, $ne: null } },
      [
        {
          $set: {
            categorias: ["$categoria"],
          },
        },
        {
          $unset: "categoria",
        },
      ]
    );

    res.json({
      mensaje: `✅ Migración completada`,
      modificados: result.modifiedCount,
      mensaje2: "Recarga la página para ver los cambios",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
