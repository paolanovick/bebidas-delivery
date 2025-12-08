import express from "express";
import {
  crearPedido,
  obtenerMisPedidos,
  listarTodosPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
  eliminarTodosPedidos,
  eliminarHistorialUsuario,
} from "../controllers/pedidosController.js";
import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js";

const router = express.Router();

// 🟢 Crear pedido (no requiere login)
router.post("/", crearPedido);

// 🟢 Ver pedidos por email (no requiere login)
// Ejemplo: GET /api/pedidos/mis-pedidos/cliente@email.com
router.get("/mis-pedidos/:emailCliente", obtenerMisPedidos);

// 🔐 Rutas solo para administradores
router.get("/", verificarToken, esAdmin, listarTodosPedidos);
router.put("/:id/estado", verificarToken, esAdmin, actualizarEstadoPedido);
router.delete(
  "/historial/:usuarioId",
  verificarToken,
  esAdmin,
  eliminarHistorialUsuario
);
// 🗑️ Eliminar un pedido individual
router.delete("/:id", verificarToken, esAdmin, eliminarPedido);

// 🧹 Eliminar todos los pedidos
router.delete("/", verificarToken, esAdmin, eliminarTodosPedidos);
export default router;
