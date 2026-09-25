import { createHash } from "crypto";
import { gzipSync } from "zlib";

// El catálogo vive en MongoDB Atlas, fuera del droplet: cada consulta tarda
// más de un segundo. Se guarda la respuesta ya serializada y comprimida y se
// descarta en cuanto cualquier escritura toca una bebida (ver models/Bebida.js).
// El vencimiento cubre cambios hechos por fuera de la API.
const VENCIMIENTO_MS = 60_000;

let entrada = null;
let generacion = 0;
let enCurso = null;

export const invalidarBebidasCache = () => {
  generacion += 1;
  entrada = null;
  enCurso = null;
};

const empaquetar = (datos) => {
  const json = JSON.stringify(datos);
  const hash = createHash("sha1").update(json).digest("base64url");

  return { json, gzip: gzipSync(json), etag: `W/"${hash}"` };
};

export const obtenerBebidasCacheadas = async (cargar) => {
  if (entrada && Date.now() - entrada.guardadoEn < VENCIMIENTO_MS) {
    return entrada.respuesta;
  }

  // Varias visitas simultáneas comparten una sola consulta a la base.
  if (!enCurso) {
    const generacionInicial = generacion;
    const consulta = (async () => {
      try {
        const respuesta = empaquetar(await cargar());
        // Si hubo una escritura mientras se consultaba, esos datos ya son viejos.
        if (generacionInicial === generacion) {
          entrada = { respuesta, guardadoEn: Date.now() };
        }
        return respuesta;
      } finally {
        if (enCurso === consulta) enCurso = null;
      }
    })();
    enCurso = consulta;
  }

  return enCurso;
};
