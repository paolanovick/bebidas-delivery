import mongoose from "mongoose";

const ConfiguracionHorariosSchema = new mongoose.Schema({
  diasDisponibles: {
    type: [String],
    enum: [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ],
    default: ["lunes", "martes", "miercoles", "jueves", "viernes"],
  },
  horaInicio: { type: String, default: "09:00" }, // formato HH:MM
  horaFin: { type: String, default: "20:00" },
  duracionSlot: { type: Number, default: 60 }, // en minutos
  diasAnticipacion: { type: Number, default: 0 }, // cuántos días de anticipación mínima
  pedidosSimultaneosPorSlot: { type: Number, default: 5 }, // cuántos pedidos por slot
  activo: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now },
});

export default mongoose.model(
  "ConfiguracionHorario",
  configuracionHorarioSchema,
  "configuracionhorarios"
);
