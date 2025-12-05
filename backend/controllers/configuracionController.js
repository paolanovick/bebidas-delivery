import Configuracion from "../models/Configuracion.js";

export const obtenerConfiguracionEnvio = async (req, res) => {
  let config = await Configuracion.findOne();
  if (!config) {
    config = await Configuracion.create({});
  }
  res.json(config);
};

export const actualizarConfiguracionEnvio = async (req, res) => {
  const { costoEnvio, envioHabilitado } = req.body;

  let config = await Configuracion.findOne();
  if (!config) {
    config = new Configuracion();
  }

  config.costoEnvio = costoEnvio;
  config.envioHabilitado = envioHabilitado;

  await config.save();

  res.json({ mensaje: "Configuración actualizada", config });
};
