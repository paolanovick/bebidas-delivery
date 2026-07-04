import React, { useEffect, useRef, useState } from "react";
import { getEnvioConfig } from "../services/api";

const TICKER_PX_POR_SEGUNDO = 78;
const TICKER_DURACION_MINIMA = 8;

export default function BannerTicker() {
  const mensajeDefault = "📦 Envío gratis en compras mayores a $40.000";
  const [mensaje, setMensaje] = useState(mensajeDefault);
  const [duracion, setDuracion] = useState(14);
  const grupoRef = useRef(null);

  useEffect(() => {
    let activo = true;

    const cargarMensaje = async () => {
      try {
        const config = await getEnvioConfig();
        const texto = config?.mensajeTicker?.trim();
        if (activo && texto) {
          setMensaje(texto);
        }
      } catch (error) {
        console.error("Error cargando banner de envío:", error);
      }
    };

    cargarMensaje();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const calcularDuracion = () => {
      const anchoGrupo = grupoRef.current?.scrollWidth || 0;
      if (!anchoGrupo) return;

      setDuracion(
        Math.max(TICKER_DURACION_MINIMA, anchoGrupo / TICKER_PX_POR_SEGUNDO)
      );
    };

    calcularDuracion();
    window.addEventListener("resize", calcularDuracion);

    return () => window.removeEventListener("resize", calcularDuracion);
  }, [mensaje]);

  const mensajes = Array.from({ length: 8 }, (_, index) => (
    <span key={index} className="text-sm font-semibold text-[#590707]">
      {mensaje}
    </span>
  ));

  return (
    <div
      className="w-full overflow-hidden py-2"
      style={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="ticker-track whitespace-nowrap"
        style={{ "--ticker-duration": `${duracion}s` }}
      >
        <div ref={grupoRef} className="ticker-group">
          {mensajes}
        </div>
        <div className="ticker-group" aria-hidden="true">
          {mensajes}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll var(--ticker-duration) linear infinite;
          will-change: transform;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-group {
          display: flex;
          flex: 0 0 auto;
          gap: clamp(2rem, 4vw, 4rem);
          padding-right: clamp(2rem, 4vw, 4rem);
        }
      `}</style>
    </div>
  );
}
