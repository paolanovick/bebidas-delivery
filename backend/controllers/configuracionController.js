import Configuracion from "../models/Configuracion.js";
import ConfigIncentivo from "../models/ConfigIncentivo.js";

// ==================== CONFIGURACIÓN DE ENVÍO (ORIGINAL) ====================
export const obtenerConfiguracionEnvio = async (req, res) => {
  let config = await Configuracion.findOne();
  if (!config) {
    config = await Configuracion.create({});
  }
  const data = config.toObject();
  res.json({
    ...data,
    activo: data.envioHabilitado,
    montoMinimoEnvioGratis: data.montoMinimoEnvioGratis ?? 40000,
    mensaje: data.mensaje || "",
    mensajeTicker: data.mensajeTicker || "",
  });
};

export const actualizarConfiguracionEnvio = async (req, res) => {
  const {
    costoEnvio,
    envioHabilitado,
    activo,
    montoMinimoEnvioGratis,
    mensaje,
    mensajeTicker,
  } = req.body;

  let config = await Configuracion.findOne();
  if (!config) {
    config = new Configuracion();
  }

  if (costoEnvio !== undefined) {
    config.costoEnvio = Number(costoEnvio) || 0;
  }

  if (envioHabilitado !== undefined || activo !== undefined) {
    config.envioHabilitado = envioHabilitado ?? activo;
  }

  if (montoMinimoEnvioGratis !== undefined) {
    config.montoMinimoEnvioGratis = Number(montoMinimoEnvioGratis) || 0;
  }

  if (mensaje !== undefined) {
    config.mensaje = mensaje;
  }

  if (mensajeTicker !== undefined) {
    config.mensajeTicker = mensajeTicker;
  }

  await config.save();

  if (montoMinimoEnvioGratis !== undefined) {
    const configIncentivo =
      (await ConfigIncentivo.findOne()) || new ConfigIncentivo();
    configIncentivo.montoMinimoEnvioGratis =
      Number(montoMinimoEnvioGratis) || 0;
    await configIncentivo.save();
  }

  const data = config.toObject();
  res.json({
    mensaje: "Configuración actualizada",
    config: {
      ...data,
      activo: data.envioHabilitado,
      montoMinimoEnvioGratis: data.montoMinimoEnvioGratis ?? 40000,
      mensaje: data.mensaje || "",
      mensajeTicker: data.mensajeTicker || "",
    },
  });
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
    const configEnvio = await Configuracion.findOne();

    if (!config) {
      config = await ConfigIncentivo.create({
        textoIncentivo: "¡Estás cerca del envío gratis!",
        montoMinimoEnvioGratis:
          configEnvio?.montoMinimoEnvioGratis ?? 40000,
        categoriasProductosSugeridos: ["Snacks", "Gaseosas y jugos", "Extras y hielo"],
      });
    } else if (configEnvio?.montoMinimoEnvioGratis !== undefined) {
      config.montoMinimoEnvioGratis = configEnvio.montoMinimoEnvioGratis;
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

    let configEnvio = await Configuracion.findOne();
    if (!configEnvio) {
      configEnvio = new Configuracion();
    }
    configEnvio.montoMinimoEnvioGratis =
      Number(montoMinimoEnvioGratis) || 0;
    await configEnvio.save();

    res.json(config);
  } catch (error) {
    console.error("Error al actualizar config incentivo:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
