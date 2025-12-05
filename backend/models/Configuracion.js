import mongoose from "mongoose";

const ConfiguracionSchema = new mongoose.Schema({
  costoEnvio: { type: Number, default: 1000 },
  envioHabilitado: { type: Boolean, default: true },
});

export default mongoose.model(
  "Configuracion",
  ConfiguracionSchema,
  "configuracion"
);
