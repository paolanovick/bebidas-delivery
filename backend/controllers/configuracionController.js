import Configuracion from "../models/Configuracion.js";
import ConfigIncentivo from "../models/ConfigIncentivo.js";

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
// Obtener configuración de incentivo
export const obtenerConfiguracionIncentivo = async (req, res) => {
  try {
    let config = await ConfigIncentivo.findOne();
    if (!config) {
      config = await ConfigIncentivo.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar configuración de incentivo
export const actualizarConfiguracionIncentivo = async (req, res) => {
  try {
    let config = await ConfigIncentivo.findOne();
    if (!config) {
      config = new ConfigIncentivo(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
