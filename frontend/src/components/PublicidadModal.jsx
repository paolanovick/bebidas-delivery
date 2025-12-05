import React, { useEffect, useState } from "react";
import { getPublicidad } from "../services/api";
import { useLocation } from "react-router-dom";

export default function PublicidadModal() {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [publicidad, setPublicidad] = useState(null);

  const location = useLocation();

  // Ver si ya se mostró hoy
  const publicidadMostradaHoy = () => {
    const guardado = localStorage.getItem("publicidad-mostrada");
    if (!guardado) return false;
    const datos = JSON.parse(guardado);
    return datos.fecha === new Date().toDateString();
  };

  const marcarComoMostradaHoy = () => {
    localStorage.setItem(
      "publicidad-mostrada",
      JSON.stringify({ fecha: new Date().toDateString() })
    );
  };

  useEffect(() => {
    if (location.pathname !== "/tienda") return;
    if (publicidadMostradaHoy()) return;

    const cargar = async () => {
      try {
        const data = await getPublicidad();

        if (data.activo && data.imagenUrl) {
          // Mostrar 2 segundos después de entrar a tienda
          setTimeout(() => {
            setPublicidad({ imagenUrl: data.imagenUrl });
            setVisible(true);

            // Fade-in
            setTimeout(() => setOpacity(1), 50);

            // Fade-out después de 3 segundos
            setTimeout(() => {
              setOpacity(0);
              setTimeout(() => setVisible(false), 500);
            }, 3000);

            marcarComoMostradaHoy();
          }, 2000);
        }
      } catch (err) {
        console.error("Error al cargar publicidad:", err);
      }
    };

    cargar();
  }, [location.pathname]);

  if (!visible || !publicidad) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50 
        bg-black/60 backdrop-blur-md 
        transition-opacity duration-500 ease-out
      `}
      style={{ opacity }}
    >
      <div className="bg-white rounded-xl p-3 shadow-xl w-[90%] max-w-sm mx-auto">
        <img
          src={publicidad.imagenUrl}
          alt="Publicidad"
          className="rounded-lg w-full h-auto object-contain animate-zoomIn"
        />
      </div>
    </div>
  );
}
