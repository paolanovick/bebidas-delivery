import express from "express";
import {
  obtenerPublicidad,
  actualizarPublicidad,
} from "../controllers/publicidadController.js";

import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/auth.js"; // tu middleware real

const router = express.Router();

// GET público → cualquier visitante puede ver la publicidad
router.get("/", obtenerPublicidad);

// PUT privado → solo admin con token
router.put("/", verificarToken, esAdmin, actualizarPublicidad);

export default router;
