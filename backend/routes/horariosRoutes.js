// routes/horariosRoutes.js
import express from "express";
import { verificarToken } from "../middleware/auth.js";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  // obtenerSlotsDisponibles, // ❌ ya no lo usamos
} from "../controllers/horariosController.js";

const router = express.Router();

// ✅ Obtener config de horarios (público: lo usa el menú)
router.get("/configuracion", obtenerConfiguracion);

// ✅ Actualizar config (solo admin, requiere token)
router.put("/configuracion", verificarToken, actualizarConfiguracion);

// ❌ Ruta de slots desactivada (ya no se usa en el frontend)
/*
// router.get("/slots-disponibles", obtenerSlotsDisponibles);
*/

export default router;
