import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: false, // ✅ Ahora compra sin estar logueado es posible
  },

  // ✅ CAMPO CORRECTO PARA CLIENTE NO REGISTRADO
  emailCliente: { type: String, required: true },

  items: [
    {
      bebida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bebida",
        required: true,
      },
      nombre: String,
      precio: Number,
      cantidad: { type: Number, required: true, min: 1 },
    },
  ],

  total: { type: Number, required: true },

  estado: {
    type: String,
    enum: ["pendiente", "confirmado", "enviado", "entregado", "cancelado"],
    default: "pendiente",
  },

  direccionEntrega: { type: String, required: true },
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
