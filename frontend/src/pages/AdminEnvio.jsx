import React, { useState, useEffect } from "react";
import { getEnvioConfig, updateEnvioConfig } from "../services/api";

export default function AdminEnvio() {
  const [costoEnvio, setCostoEnvio] = useState(1000);
  const [envioHabilitado, setEnvioHabilitado] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarConfig();
  }, []);

  const cargarConfig = async () => {
    try {
      const data = await getEnvioConfig();
      setCostoEnvio(data.costoEnvio);
      setEnvioHabilitado(data.envioHabilitado);
    } catch (err) {
      console.error("Error cargando configuración:", err);
    }
  };

  const guardar = async () => {
    try {
      await updateEnvioConfig({ costoEnvio, envioHabilitado });
      setMensaje("✔ Configuración guardada correctamente");

      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error("Error guardando configuración:", err);
      setMensaje("❌ Error al guardar");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#04090C]">
        🚚 Configuración de Envíos
      </h2>

      {mensaje && (
        <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
          {mensaje}
        </div>
      )}

      <label className="font-semibold text-[#04090C]">Costo de Envío ($)</label>
      <input
        type="number"
        value={costoEnvio}
        onChange={(e) => setCostoEnvio(Number(e.target.value))}
        className="w-full p-2 border border-[#CDC7BD] rounded mb-4"
      />

      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={envioHabilitado}
          onChange={() => setEnvioHabilitado(!envioHabilitado)}
        />
        <span className="text-[#04090C]">
          Habilitar envío (si lo desactivás → envío gratis)
        </span>
      </label>

      <button
        onClick={guardar}
        className="bg-[#590707] hover:bg-[#A30404] text-white px-6 py-3 rounded-lg shadow font-semibold"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
