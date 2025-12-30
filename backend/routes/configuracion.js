import express from "express";
import {
  obtenerConfiguracionEnvio,
  actualizarConfiguracionEnvio,
  getConfigIncentivo,
  updateConfigIncentivo,
} from "../controllers/configuracionController.js";
import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js";

const router = express.Router();

// Rutas de configuración de envío
router.get("/", obtenerConfiguracionEnvio);
router.put("/", verificarToken, esAdmin, actualizarConfiguracionEnvio);

// Rutas de configuración de incentivo (NUEVAS)
router.get("/incentivo", getConfigIncentivo);
router.put("/incentivo", verificarToken, esAdmin, updateConfigIncentivo);

export default router;