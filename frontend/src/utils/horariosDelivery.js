// src/utils/horariosDelivery.js

export function getEstadoDelivery(config) {
  if (!config) return null;

  const { activo, diasDisponibles = [], horaInicio, horaFin } = config;

  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 5);

  const diaSemana = ahora
    .toLocaleDateString("es-ES", { weekday: "long" })
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const diasNormalizados = diasDisponibles.map((d) =>
    d
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  );

  // 🟥 Si el sistema está apagado
  if (!activo) {
    return {
      abierto: false,
      mensaje: "🚫 Hoy no se realizan entregas.",
    };
  }

  // 🟥 Si hoy NO es un día habilitado
  if (!diasNormalizados.includes(diaSemana)) {
    return {
      abierto: false,
      mensaje: `🚫 Hoy no se realizan entregas. Días de entrega: ${diasDisponibles.join(
        ", "
      )}.`,
    };
  }

  // 🕒 Evaluar hora actual vs horario configurado
  if (horaActual < horaInicio) {
    return {
      abierto: false,
      mensaje: `🕒 Hoy entregamos a partir de las ${horaInicio}.`,
    };
  }

  if (horaActual > horaFin) {
    return {
      abierto: false,
      mensaje: `⚠️ Ya cerramos las entregas por hoy. Nuestro horario de hoy fue de ${horaInicio} a ${horaFin}.`,
    };
  }

  // 🟢 Dentro del horario
  return {
    abierto: true,
    mensaje: `🟢 Entregando ahora — horario de hoy: ${horaInicio} a ${horaFin}.`,
  };
}
