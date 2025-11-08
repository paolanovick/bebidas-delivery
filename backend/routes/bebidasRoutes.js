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

// ✅ Lista bebidas (público)
router.get("/", getBebidas);

// ✅ Las siguientes requieren token (solo admin)
router.post("/", verificarToken, agregarBebida);
router.put("/:id", verificarToken, editarBebida);
router.delete("/:id", verificarToken, eliminarBebida);

export default router;
