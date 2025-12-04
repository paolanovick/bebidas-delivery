import express from "express";
import {
  obtenerPublicidad,
  actualizarPublicidad,
} from "../controllers/publicidadController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Público → carga la publicidad para mostrar en el sitio
router.get("/", obtenerPublicidad);

// Solo admin puede actualizar
router.put("/", authMiddleware, adminMiddleware, actualizarPublicidad);

export default router;
