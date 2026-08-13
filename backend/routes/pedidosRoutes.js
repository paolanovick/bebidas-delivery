import express from "express";
import {
  crearPedido,
  obtenerMisPedidos,
  obtenerPedidoPorId,
  listarTodosPedidos,
  actualizarEstadoPedido,
  actualizarEstadoPago,
  registrarComprobantePago,
  eliminarPedido,
  eliminarTodosPedidos,
  eliminarHistorialUsuario,
} from "../controllers/pedidosController.js";
import { verificarToken } from "../middleware/auth.js";
import esAdmin from "../middleware/esAdmin.js";

const router = express.Router();

// 🟢 Crear pedido (público - no requiere login; monitor usa dryRun con token)
router.post("/", crearPedido);

// 🟢 Ver pedidos por email (público - no requiere login)
router.get("/mis-pedidos/:emailCliente", obtenerMisPedidos);

// 🟢 Ver un pedido por ID (público para landing de pago)
router.get("/:id", obtenerPedidoPorId);

// 🟢 Subir comprobante de pago (público)
router.put("/:id/comprobante", registrarComprobantePago);

// 🔐 ADMIN - Actualizar estado de un pedido
router.put("/:id/estado", verificarToken, esAdmin, actualizarEstadoPedido);

// ADMIN - Aprobar o rechazar un comprobante
router.put("/:id/estado-pago", verificarToken, esAdmin, actualizarEstadoPago);

// 🗑️ ADMIN - Eliminar TODOS los pedidos (DEBE IR ANTES de /:id)
router.delete("/todos", verificarToken, esAdmin, eliminarTodosPedidos);

// 🗑️ ADMIN - Eliminar UN pedido individual
router.delete("/:id", verificarToken, esAdmin, eliminarPedido);

// 🗑️ ADMIN - Eliminar historial de un usuario
router.delete("/historial/:usuarioId", verificarToken, esAdmin, eliminarHistorialUsuario);
// 🔐 ADMIN - Listar todos los pedidos
router.get("/", verificarToken, esAdmin, listarTodosPedidos);

export default router;
