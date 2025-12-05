import React, { useEffect, useState } from "react";
import { getEnvioConfig, updateEnvioConfig } from "../services/api";

export default function AdminEnvio() {
  const [costoEnvio, setCostoEnvio] = useState(1000);
  const [envioHabilitado, setEnvioHabilitado] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 🔹 Cargar configuración actual
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getEnvioConfig();
        setCostoEnvio(data.costoEnvio);
        setEnvioHabilitado(data.envioHabilitado);
      } catch (e) {
        console.error("Error cargando config:", e);
      }
    };
    cargar();
  }, []);

  // 🔹 Guardar cambios
  const guardar = async () => {
    setGuardando(true);
    try {
      await updateEnvioConfig({ costoEnvio, envioHabilitado });
      alert("Configuración guardada ✔");
    } catch (e) {
      alert("Error al guardar");
      console.error(e);
    }
    setGuardando(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-[#04090C]">
        Configuración de Envío
      </h2>

      {/* Habilitar / deshabilitar envío */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={envioHabilitado}
          onChange={() => setEnvioHabilitado(!envioHabilitado)}
        />
        <span className="text-[#04090C] font-semibold">
          Envío a domicilio habilitado
        </span>
      </label>

      {/* Costo del envío */}
      <label className="block font-semibold text-[#04090C]">
        Costo del envío ($)
      </label>
      <input
        type="number"
        value={costoEnvio}
        onChange={(e) => setCostoEnvio(Number(e.target.value))}
        className="border p-2 rounded w-full mb-4 bg-white text-[#04090C]"
      />

      <button
        onClick={guardar}
        disabled={guardando}
        className="bg-[#590707] text-white px-4 py-2 rounded-lg hover:bg-[#A30404] disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
