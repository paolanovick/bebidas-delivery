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

// 🟢 Crear pedido (público - no requiere login)
router.post("/", crearPedido);

// 🟢 Ver pedidos por email (público - no requiere login)
router.get("/mis-pedidos/:emailCliente", obtenerMisPedidos);

// 🔐 ADMIN - Listar todos los pedidos
router.get("/", verificarToken, esAdmin, listarTodosPedidos);

// 🔐 ADMIN - Actualizar estado de un pedido
router.put("/:id/estado", verificarToken, esAdmin, actualizarEstadoPedido);

// 🗑️ ADMIN - Eliminar TODOS los pedidos (DEBE IR ANTES de /:id)
router.delete("/todos", verificarToken, esAdmin, eliminarTodosPedidos);

// 🗑️ ADMIN - Eliminar UN pedido individual
router.delete("/:id", verificarToken, esAdmin, eliminarPedido);

// 🗑️ ADMIN - Eliminar historial de un usuario
router.delete("/historial/:usuarioId", verificarToken, esAdmin, eliminarHistorialUsuario);

export default router;