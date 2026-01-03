import Pedido from "../models/Pedido.js";
import Bebida from "../models/Bebida.js";
import Configuracion from "../models/Configuracion.js";

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
      return res
        .status(400)
        .json({ mensaje: "Debes agregar bebidas al pedido" });

    let total = 0;
    const itemsValidados = [];

    // 🟢 Validar items y calcular subtotal
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

    // 🟢 Cargar configuración actual de envío desde MongoDB
    const config = (await Configuracion.findOne()) || {
      costoEnvio: 0,
      envioHabilitado: false,
    };

    // 🟢 Determinar costo de envío dinámico
    let costoEnvio = 0;

    // Tiene dirección (es envío) + envío habilitado → se cobra
    if (
      direccionEntrega &&
      direccionEntrega.trim() !== "" &&
      config.envioHabilitado
    ) {
      costoEnvio = config.costoEnvio ?? 0;
    }

    const totalFinal = total + costoEnvio;

    // 🟢 Crear pedido con envío incluido
    const pedidoData = {
      usuario: usuarioId,
      emailCliente,
      items: itemsValidados,
      total: totalFinal,
      costoEnvio,
      direccionEntrega,
      telefono,
      notas,
    };

    if (fechaEntrega) pedidoData.fechaEntrega = new Date(fechaEntrega);
    if (horaEntrega) pedidoData.horaEntrega = horaEntrega;

    const nuevoPedido = new Pedido(pedidoData);

    await nuevoPedido.save();
    await nuevoPedido.populate("items.bebida", "nombre imagen");

    res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      pedido: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error al crear pedido" });
  }
};

// ... resto del código igual