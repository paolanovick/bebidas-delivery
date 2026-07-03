import mongoose from "mongoose";

const ConfiguracionSchema = new mongoose.Schema({
  costoEnvio: { type: Number, default: 1000 },
  envioHabilitado: { type: Boolean, default: true },
  montoMinimoEnvioGratis: { type: Number, default: 40000 },
  mensaje: { type: String, default: "" },
  mensajeTicker: {
    type: String,
    default: "📦 Envío gratis en compras mayores a $40.000",
  },
});

export default mongoose.model(
  "Configuracion",
  ConfiguracionSchema,
  "configuracion"
);
