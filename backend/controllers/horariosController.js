// controllers/horariosController.js
import ConfiguracionHorarios from "../models/ConfiguracionHorarios.js";
// import Pedido from "../models/Pedido.js";  // ❌ Ya no lo usamos por ahora

// ❌ Ya no usamos normalize ni slots, los dejamos comentados por si en el futuro volvemos a turnos
/*
// Normaliza strings (quita tildes)
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
*/

// GET /api/horarios/configuracion
export const obtenerConfiguracion = async (req, res) => {
  try {
    const config = await ConfiguracionHorarios.findOne();
    if (!config) return res.json({});
    res.json(config);
  } catch (error) {
    console.error("Error al obtener configuración de horarios:", error);
    res.status(500).json({ mensaje: "Error al obtener configuración" });
  }
};

// PUT /api/horarios/configuracion
export const actualizarConfiguracion = async (req, res) => {
  try {
    const config = await ConfiguracionHorarios.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json({ mensaje: "Configuración actualizada", config });
  } catch (error) {
    console.error("Error al actualizar configuración de horarios:", error);
    res.status(500).json({ mensaje: "Error al actualizar configuración" });
  }
};

/* 
// ❌ YA NO SE USA: GET /api/horarios/slots-disponibles?fecha=YYYY-MM-DD
// La dejamos comentada por si en el futuro el cliente quiere volver a elegir turnos/hora exacta.

export const obtenerSlotsDisponibles = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.json({ slots: [] });

    const config = await ConfiguracionHorarios.findOne();
    if (!config || !config.activo) return res.json({ slots: [] });

    const fechaObj = new Date(fecha);
    const diaSemana = normalize(
      fechaObj.toLocaleDateString("es-ES", { weekday: "long" })
    );

    if (!config.diasDisponibles.map(normalize).includes(diaSemana)) {
      return res.json({ slots: [] });
    }

    const slots = [];
    let [hInicio, mInicio] = config.horaInicio.split(":").map(Number);
    let [hFin, mFin] = config.horaFin.split(":").map(Number);

    let current = new Date(fechaObj);
    current.setHours(hInicio, mInicio, 0);

    const end = new Date(fechaObj);
    end.setHours(hFin, mFin, 0);

    while (current < end) {
      const horaSlot = current.toTimeString().slice(0, 5);
      slots.push({
        hora: horaSlot,
        disponible: true,
      });

      current.setMinutes(current.getMinutes() + config.duracionSlot);
    }

    const pedidos = await Pedido.find({ fechaEntrega: fecha });

    pedidos.forEach((p) => {
      const slot = slots.find((s) => s.hora === p.horaEntrega);
      if (slot) slot.disponible = false;
    });

    res.json({ slots });
  } catch (error) {
    console.error("Error al calcular horarios:", error);
    res.status(500).json({ mensaje: "Error al calcular horarios" });
  }
};
*/
