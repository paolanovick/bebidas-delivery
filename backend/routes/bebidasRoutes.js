// routes/bebidasRoutes.js
import express from "express";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "../controllers/bebidasController.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// ------------------------------------------------------
// 🔓 RUTAS PÚBLICAS
// ------------------------------------------------------
router.get("/", getBebidas); // Obtener bebidas (con categorías normalizadas)

// ------------------------------------------------------
// 🔐 RUTAS PROTEGIDAS (solo admin)
// ------------------------------------------------------
router.post("/", verificarToken, agregarBebida); // Crear bebida
router.put("/:id", verificarToken, editarBebida); // Editar bebida
router.delete("/:id", verificarToken, eliminarBebida); // Eliminar bebida

export default router;
