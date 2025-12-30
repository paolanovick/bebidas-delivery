import Configuracion from "../models/Configuracion.js";
import ConfigIncentivo from "../models/ConfigIncentivo.js";

// ==================== CONFIGURACIÓN DE ENVÍO (ORIGINAL) ====================
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

// ==================== CONFIGURACIÓN DE INCENTIVO (ORIGINAL) ====================
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

// ==================== NUEVAS FUNCIONES PARA EL ADMIN ====================
export const getConfigIncentivo = async (req, res) => {
  try {
    let config = await ConfigIncentivo.findOne();
    
    if (!config) {
      config = await ConfigIncentivo.create({
        textoIncentivo: "¡Estás cerca del envío gratis!",
        montoMinimoEnvioGratis: 40000,
        categoriasProductosSugeridos: ["Snacks", "Gaseosas y jugos", "Extras y hielo"],
      });
    }
    
    res.json(config);
  } catch (error) {
    console.error("Error al obtener config incentivo:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

export const updateConfigIncentivo = async (req, res) => {
  try {
    const { textoIncentivo, montoMinimoEnvioGratis, categoriasProductosSugeridos } = req.body;
    
    let config = await ConfigIncentivo.findOne();
    
    if (!config) {
      config = new ConfigIncentivo({
        textoIncentivo,
        montoMinimoEnvioGratis,
        categoriasProductosSugeridos,
      });
    } else {
      config.textoIncentivo = textoIncentivo;
      config.montoMinimoEnvioGratis = montoMinimoEnvioGratis;
      config.categoriasProductosSugeridos = categoriasProductosSugeridos;
    }
    
    await config.save();
    res.json(config);
  } catch (error) {
    console.error("Error al actualizar config incentivo:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};