import ConfigIncentivo from "../models/ConfigIncentivo.js";

// ==================== OBTENER CONFIG INCENTIVO ====================
export const getConfigIncentivo = async (req, res) => {
  try {
    let config = await ConfigIncentivo.findOne();
    
    if (!config) {
      // Crear config por defecto si no existe
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

// ==================== ACTUALIZAR CONFIG INCENTIVO ====================
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