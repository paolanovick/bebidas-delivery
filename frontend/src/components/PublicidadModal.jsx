import React, { useEffect, useState } from "react";
import { getPublicidad } from "../services/api";

export default function PublicidadModal() {
  const [visible, setVisible] = useState(false);
  const [publicidad, setPublicidad] = useState(null);

  useEffect(() => {
    const cargarPublicidad = async () => {
      try {
        const data = await getPublicidad();
        // data = { imagenUrl: "...", activo: true }

        if (data.activo && data.imagenUrl) {
          setTimeout(() => {
            setPublicidad(data);
            setVisible(true);
          }, 3000);
        }
      } catch (err) {
        console.error("Error al cargar publicidad:", err);
      }
    };

    cargarPublicidad();
  }, []);

  if (!visible || !publicidad) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 shadow-xl max-w-md w-[90%] relative">
        {/* Botón cerrar */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-black text-2xl"
        >
          ×
        </button>

        {/* Imagen */}
        <img
          src={publicidad.imagenUrl}
          alt="Publicidad"
          className="rounded-lg w-full object-cover"
        />
      </div>
    </div>
  );
}
