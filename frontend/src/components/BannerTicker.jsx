import React, { useEffect, useState } from "react";
import { getEnvioConfig } from "../services/api";

export default function BannerTicker() {
  const mensajeDefault = "📦 Envío gratis en compras mayores a $40.000";
  const [mensaje, setMensaje] = useState(mensajeDefault);

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

  const mensajes = Array.from({ length: 4 }, (_, index) => (
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
      <div className="flex animate-scroll whitespace-nowrap">
        <div className="flex gap-12 pr-12">
          {mensajes}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
