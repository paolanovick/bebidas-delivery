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
    const {
      imagenUrl,
      activo,
      tipo,
      titulo,
      subtitulo,
      botonTexto,
      whatsappNumero,
    } = req.body;

    const datosPublicidad = {
      imagenUrl: imagenUrl || "",
      activo: Boolean(activo),
      tipo:
        tipo === "formulario_envio_gratis" || tipo === "imagen"
          ? tipo
          : "imagen",
      titulo:
        titulo || "GANASTE UN ENVIO GRATIS POR EL GOL DE ARGENTINA",
      subtitulo: subtitulo || "Completa tus datos para reclamar tu beneficio.",
      botonTexto: botonTexto || "Enviar datos por WhatsApp",
      whatsappNumero: whatsappNumero || "5492494252530",
    };

    let publicidad = await Publicidad.findOne();

    if (!publicidad) {
      publicidad = new Publicidad(datosPublicidad);
    } else {
      Object.assign(publicidad, datosPublicidad);
    }

    await publicidad.save();

    res.json({ mensaje: "Publicidad actualizada", publicidad });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar publicidad" });
  }
};
