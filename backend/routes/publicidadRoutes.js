import express from "express";
import {
  obtenerPublicidad,
  actualizarPublicidad,
} from "../controllers/publicidadController.js";

import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js"; // ← CORRECTO

const router = express.Router();

// GET público
router.get("/", obtenerPublicidad);

// PUT solo admin
router.put("/", verificarToken, esAdmin, actualizarPublicidad);

export default router;
