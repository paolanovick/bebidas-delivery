import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: false, // ✅ Ahora compra sin estar logueado es posible
  },

  // ✅ CAMPO CORRECTO PARA CLIENTE NO REGISTRADO
  emailCliente: { type: String, required: false },

  items: [
    {
      bebida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bebida",
        required: false,
      },
      nombre: String,
      precio: Number,
      cantidad: { type: Number, required: true, min: 1 },
      origenCarrito: {
        type: String,
        enum: ["catalogo", "tienda"],
        default: "catalogo",
      },
      ventaSinControlStock: { type: Boolean, default: false },
    },
  ],

  total: { type: Number, required: true },

  estado: {
    type: String,
    enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
    default: "pendiente",
  },

  metodoPago: {
    type: String,
    enum: ["efectivo", "transferencia"],
    default: "efectivo",
  },

  estadoPago: {
    type: String,
    enum: ["pendiente", "en_revision", "aprobado", "rechazado"],
    default: "pendiente",
  },

  aliasPago: {
    type: String,
    required: false,
    default: "",
  },

  referenciaPago: {
    type: String,
    required: false,
    default: "",
  },

  comprobantePago: {
    filename: { type: String, required: false },
    mimetype: { type: String, required: false },
    base64: { type: String, required: false },
    subidoEn: { type: Date, required: false },
  },

  modoEntrega: {
    type: String,
    enum: ["envio", "takeaway"],
    default: "envio",
  },
  direccionEntrega: { type: String, required: true },
  costoEnvio: { type: Number, default: 0 },
  telefono: String,
  notas: String,
  fecha: { type: Date, default: Date.now },

  // Ahora opcionales: el usuario no elige horario
  fechaEntrega: {
    type: Date,
    required: false,
    default: Date.now, // la fecha del pedido / entrega estimada
  },
  horaEntrega: {
    type: String,
    required: false, // puede quedar vacío
    default: "", // o null si preferís
  },
});


export default mongoose.model("Pedido", PedidoSchema, "pedidos");
