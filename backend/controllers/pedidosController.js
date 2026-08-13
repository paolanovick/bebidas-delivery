import Pedido from "../models/Pedido.js";
import Bebida from "../models/Bebida.js";
import Configuracion from "../models/Configuracion.js";
import crypto from "crypto";

const esTokenMonitorValido = (token) => {
  const esperado = process.env.MONITOR_TOKEN;
  if (!esperado || !token) return false;

  const recibidoBuffer = Buffer.from(String(token));
  const esperadoBuffer = Buffer.from(String(esperado));

  return (
    recibidoBuffer.length === esperadoBuffer.length &&
    crypto.timingSafeEqual(recibidoBuffer, esperadoBuffer)
  );
};

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
      modoEntrega,
      metodoPago,
      aliasPago,
      dryRun,
      monitorToken,
    } = req.body;

    const esDryRunMonitor = dryRun === true;

    if (esDryRunMonitor && !esTokenMonitorValido(monitorToken)) {
      return res.status(403).json({ mensaje: "Monitor no autorizado" });
    }

    const usuarioId = req.usuario?.id || null;

    if (!items || items.length === 0)
      return res
        .status(400)
        .json({ mensaje: "Debes agregar bebidas al pedido" });

   // if (!emailCliente)
      //return res.status(400).json({ mensaje: "El email es obligatorio" });

    let total = 0;
    const itemsValidados = [];

    // 🟢 Validar items y calcular subtotal
    for (const item of items) {
      const bebida = await Bebida.findById(item.bebida);
      if (!bebida)
        return res.status(404).json({ mensaje: "Bebida no encontrada" });

      const cantidad = Number(item.cantidad) || 0;
      const ventaSinControlStock =
        item.ventaSinControlStock === true || item.origenCarrito === "tienda";

      if (cantidad < 1) {
        return res.status(400).json({
          mensaje: `Cantidad inválida para ${bebida.nombre}`,
        });
      }

      if (!ventaSinControlStock && bebida.stock < cantidad)
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${bebida.nombre}`,
        });

      if (ventaSinControlStock) {
        if (!esDryRunMonitor) {
          bebida.stock -= cantidad;
          await bebida.save();
        }
      } else if (!esDryRunMonitor) {
        bebida.stock -= cantidad;
        await bebida.save();
      }

      total += bebida.precio * cantidad;

      itemsValidados.push({
        bebida: bebida._id,
        nombre: bebida.nombre,
        precio: bebida.precio,
        cantidad,
        origenCarrito: item.origenCarrito === "tienda" ? "tienda" : "catalogo",
        ventaSinControlStock,
      });
    }

    // 🟢 Cargar configuración actual de envío desde MongoDB
    const config = (await Configuracion.findOne()) || {
      costoEnvio: 0,
      envioHabilitado: false,
    };

    // 🟢 Determinar costo de envío dinámico
    const montoConfiguradoEnvioGratis = Number(config.montoMinimoEnvioGratis);
    const montoEnvioGratis =
      Number.isFinite(montoConfiguradoEnvioGratis) &&
      montoConfiguradoEnvioGratis > 0
        ? montoConfiguradoEnvioGratis
        : 40000;
    const direccionNormalizada =
      typeof direccionEntrega === "string" ? direccionEntrega.trim() : "";
    const esEnvio =
      modoEntrega === "envio" ||
      (!modoEntrega &&
        direccionNormalizada !== "" &&
        !/retira|take away/i.test(direccionNormalizada));
    let costoEnvio = 0;

    // Es envío + envío habilitado + no supera el mínimo gratis → se cobra
    if (esEnvio && config.envioHabilitado && total < montoEnvioGratis) {
      costoEnvio = Number(config.costoEnvio) || 0;
    }

    const totalFinal = total + costoEnvio;

    // 🟢 Crear pedido con envío incluido
    const pedidoData = {
      usuario: usuarioId,
      emailCliente,
      items: itemsValidados,
      total: totalFinal,
      modoEntrega: esEnvio ? "envio" : "takeaway",
      costoEnvio,
      direccionEntrega: direccionNormalizada,
      telefono,
      notas,
      metodoPago: metodoPago === "transferencia" ? "transferencia" : "efectivo",
      aliasPago: metodoPago === "transferencia" ? aliasPago || "eldanestandil" : "",
      estadoPago: metodoPago === "transferencia" ? "pendiente" : "pendiente",
    };

    if (fechaEntrega) pedidoData.fechaEntrega = new Date(fechaEntrega);
    if (horaEntrega) pedidoData.horaEntrega = horaEntrega;

    if (esDryRunMonitor) {
      return res.status(200).json({
        mensaje: "Pedido validado correctamente",
        dryRun: true,
        pedido: pedidoData,
      });
    }

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

// 🟢 Obtener pedido por ID (público)
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findById(id).populate("items.bebida", "nombre imagen");

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.json({
      _id: pedido._id,
      total: pedido.total,
      metodoPago: pedido.metodoPago,
      estadoPago: pedido.estadoPago,
      aliasPago: pedido.aliasPago,
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ mensaje: "Error al obtener el pedido" });
  }
};

// 🟢 Registrar comprobante de pago (público)
export const registrarComprobantePago = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      metodoPago,
      aliasPago,
      referenciaPago,
      comentarioPago,
      comprobanteBase64,
      comprobanteNombre,
      comprobanteTipo,
    } = req.body;

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    pedido.metodoPago = metodoPago || pedido.metodoPago || "transferencia";
    if (aliasPago) pedido.aliasPago = aliasPago;
    if (referenciaPago) pedido.referenciaPago = referenciaPago;
    if (comentarioPago) pedido.notas = `${pedido.notas || ""} [Comprobante] ${comentarioPago}`.trim();

    if (comprobanteBase64) {
      const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!tiposPermitidos.includes(comprobanteTipo)) {
        return res.status(400).json({ mensaje: "El comprobante debe ser una imagen o PDF" });
      }

      if (comprobanteBase64.length > 4_200_000) {
        return res.status(413).json({ mensaje: "El comprobante supera el tamaño permitido" });
      }

      pedido.comprobantePago = {
        filename: comprobanteNombre || "comprobante",
        mimetype: comprobanteTipo || "image/jpeg",
        base64: comprobanteBase64,
        subidoEn: new Date(),
      };
      pedido.estadoPago = "en_revision";
    }

    await pedido.save();

    res.json({ mensaje: "Comprobante recibido", pedido });
  } catch (error) {
    console.error("Error al registrar comprobante:", error);
    res.status(500).json({ mensaje: "Error al registrar comprobante" });
  }
};

// Actualizar la revisión del pago (admin)
export const actualizarEstadoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoPago } = req.body;
    const estadosPermitidos = ["pendiente", "en_revision", "aprobado", "rechazado"];

    if (!estadosPermitidos.includes(estadoPago)) {
      return res.status(400).json({ mensaje: "Estado de pago inválido" });
    }

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    pedido.estadoPago = estadoPago;
    if (estadoPago === "aprobado" && pedido.estado === "pendiente") {
      pedido.estado = "confirmado";
    }
    await pedido.save();

    res.json({ mensaje: "Estado de pago actualizado", pedido });
  } catch (error) {
    console.error("Error al actualizar estado de pago:", error);
    res.status(500).json({ mensaje: "Error al actualizar estado de pago" });
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
    const pedidos = await Pedido.find().populate(
      "items.bebida",
      "nombre imagen"
    );
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

// 🧾 Eliminar historial de un usuario específico
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
