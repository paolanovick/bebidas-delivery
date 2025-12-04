import Publicidad from "../models/Publicidad.js";

// Obtener publicidad actual
export const obtenerPublicidad = async (req, res) => {
  try {
    const pub = await Publicidad.findOne();
    if (!pub) return res.json({ imagenUrl: null, activo: false });

    res.json(pub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener publicidad" });
  }
};

// Actualizar o crear publicidad
export const actualizarPublicidad = async (req, res) => {
  try {
    const { imagenUrl, activo } = req.body;

    let publicidad = await Publicidad.findOne();

    if (!publicidad) {
      publicidad = new Publicidad({ imagenUrl, activo });
    } else {
      publicidad.imagenUrl = imagenUrl;
      publicidad.activo = activo;
    }

    await publicidad.save();

    res.json({ mensaje: "Publicidad actualizada", publicidad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar publicidad" });
  }
};
