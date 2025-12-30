import express from "express";
import {
  obtenerConfiguracionEnvio,
  actualizarConfiguracionEnvio,
  obtenerConfiguracionIncentivo,
  actualizarConfiguracionIncentivo,
} from "../controllers/configuracionController.js";
import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js";

const router = express.Router();

// Rutas de configuración de envío
router.get("/", obtenerConfiguracionEnvio);
router.put("/", verificarToken, esAdmin, actualizarConfiguracionEnvio);

// Rutas de configuración de incentivo
router.get("/incentivo", obtenerConfiguracionIncentivo);
router.put("/incentivo", verificarToken, esAdmin, actualizarConfiguracionIncentivo);

export default router;