import express from "express";
import {
  obtenerConfiguracionEnvio,
  actualizarConfiguracionEnvio,
} from "../controllers/configuracionController.js";
import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js";

const router = express.Router();

router.get("/", obtenerConfiguracionEnvio);
router.put("/", verificarToken, esAdmin, actualizarConfiguracionEnvio);

export default router;
