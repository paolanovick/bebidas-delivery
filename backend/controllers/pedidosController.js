import Pedido from "../models/Pedido.js";
import Bebida from "../models/Bebida.js";

// 🟢 Crear pedido (sin login)
export const crearPedido = async (req, res) => {
  try {
    const {
      items,
      direccionEntrega,
      telefono,
      notas,
      fechaEntrega,
      horaEntrega,
      emailCliente,
    } = req.body;

    const usuarioId = req.usuario?.id || null;

    if (!items || items.length === 0)
      return res.status(400).json({ mensaje: "Debes agregar bebidas al pedido" });

    if (!emailCliente)
      return res.status(400).json({ mensaje: "El email es obligatorio" });

    let total = 0;
    const itemsValidados = [];

    for (const item of items) {
      const bebida = await Bebida.findById(item.bebida);
      if (!bebida)
        return res.status(404).json({ mensaje: "Bebida no encontrada" });

      if (bebida.stock < item.cantidad)
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${bebida.nombre}`,
        });

      bebida.stock -= item.cantidad;
      await bebida.save();

      total += bebida.precio * item.cantidad;
      itemsValidados.push({
        bebida: bebida._id,
        nombre: bebida.nombre,
        precio: bebida.precio,
        cantidad: item.cantidad,
      });
    }

   const pedidoData = {
     usuario: usuarioId,
     emailCliente,
     items: itemsValidados,
     total,
     direccionEntrega,
     telefono,
     notas,
   };

   // Solo seteo estos campos si vienen desde el front (en el futuro, si volvés a usarlos)
   if (fechaEntrega) {
     pedidoData.fechaEntrega = new Date(fechaEntrega);
   }
   if (horaEntrega) {
     pedidoData.horaEntrega = horaEntrega;
   }

   const nuevoPedido = new Pedido(pedidoData);

   await nuevoPedido.save();
   await nuevoPedido.populate("items.bebida", "nombre imagen");


    res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error al crear pedido" });
  }
};

// 🟢 Ver pedidos de un cliente por email
export const obtenerMisPedidos = async (req, res) => {
  try {
    const { emailCliente } = req.params;
    const pedidos = await Pedido.find({ emailCliente }).sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};

// 🟣 Listar todos los pedidos (admin)
export const listarTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate("items.bebida", "nombre imagen");
    res.json(pedidos);
  } catch (error) {
    console.error("Error al listar pedidos:", error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
};

// 🟡 Actualizar estado del pedido (admin)
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Pedido.findById(id);
    if (!pedido)
      return res.status(404).json({ mensaje: "Pedido no encontrado" });

    pedido.estado = estado;
    await pedido.save();

    res.json({ mensaje: "Estado actualizado", pedido });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ mensaje: "Error al actualizar estado" });
  }
};

// 🗑️ Eliminar pedido individual (admin)
export const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    await Pedido.findByIdAndDelete(id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({ mensaje: "Error al eliminar pedido" });
  }
};

// 🧹 Eliminar todos los pedidos (admin)
export const eliminarTodosPedidos = async (req, res) => {
  try {
    await Pedido.deleteMany();
    res.json({ mensaje: "Todos los pedidos eliminados" });
  } catch (error) {
    console.error("Error al eliminar todos los pedidos:", error);
    res.status(500).json({ mensaje: "Error al eliminar todos los pedidos" });
  }
};

// 🧾 Eliminar historial de un usuario específico (admin)
export const eliminarHistorialUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    await Pedido.deleteMany({ usuario: usuarioId });
    res.json({ mensaje: "Historial del usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar historial:", error);
    res.status(500).json({ mensaje: "Error al eliminar historial" });
  }
};
