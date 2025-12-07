// src/utils/horariosDelivery.js

const normalize = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function getEstadoDelivery(config) {
  if (!config || config.activo === false) {
    return {
      estado: "inactivo",
      mensaje: "Hoy no estamos realizando entregas.",
    };
  }

  const ahora = new Date();

  const hoyNombreNormalizado = normalize(
    ahora.toLocaleDateString("es-AR", { weekday: "long" })
  );

  const diasConfig = (config.diasDisponibles || []).map(normalize);

  const horaInicio = config.horaInicio || "00:00";
  const horaFin = config.horaFin || "23:59";

  const [hiH, hiM] = horaInicio.split(":").map(Number);
  const [hfH, hfM] = horaFin.split(":").map(Number);

  const hoyHabilitado = diasConfig.includes(hoyNombreNormalizado);

  if (!hoyHabilitado) {
    const diasTexto = (config.diasDisponibles || [])
      .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
      .join(", ");

    return {
      estado: "no_hoy",
      mensaje: `Hoy no realizamos entregas. Días de entrega: ${diasTexto}.`,
    };
  }

  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes();
  const inicioMin = hiH * 60 + hiM;
  const finMin = hfH * 60 + hfM;

  const mensajeBase = `Hoy realizamos entregas desde las ${horaInicio} hasta las ${horaFin}.`;

  // if (ahoraMin < inicioMin) {
  //   return {
  //     estado: "antes",
  //     mensaje: `${mensajeBase} Comenzamos a entregar a partir de las ${horaInicio}.`,
  //   };
  // }

  if (ahoraMin >= inicioMin && ahoraMin <= finMin) {
    return {
      estado: "durante",
      mensaje: `${mensajeBase} ¡Hacé tu pedido cuando quieras!`,
    };
  }

  // return {
  //   estado: "despues",
  //   mensaje: `${mensajeBase} Ya finalizamos las entregas por hoy.`,
  // };
}
