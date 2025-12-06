import React, { useEffect, useState } from "react";
import { getEnvioConfig, updateEnvioConfig } from "../services/api";

export default function AdminEnvio() {
  const [activo, setActivo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [guardado, setGuardado] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getEnvioConfig();
        setActivo(data.activo);
        setMensaje(data.mensaje || "");
      } catch (err) {
        console.error("Error cargando configuración de envío:", err);
      }
    };
    cargar();
  }, []);

  const handleGuardar = async () => {
    try {
      await updateEnvioConfig({ activo, mensaje });
      setGuardado("Cambios guardados ✔");
      setTimeout(() => setGuardado(""), 2500);
    } catch (err) {
      console.error("Error guardando configuración:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg text-[#04090C]">
      <h2 className="text-2xl font-bold mb-4">Configuración de Envíos</h2>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
        <span className="font-semibold">Activar envíos hoy</span>
      </label>

      <div className="mb-4">
        <label className="font-semibold">
          Mensaje para mostrar al cliente:
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Ej: Hoy los envíos cuestan $800"
          className="w-full p-3 border rounded-lg bg-white"
          rows={3}
        />
      </div>

      <button
        onClick={handleGuardar}
        className="bg-[#590707] hover:bg-[#A30404] text-white px-6 py-2 rounded-lg font-semibold"
      >
        Guardar cambios
      </button>

      {guardado && (
        <p className="text-green-700 mt-3 font-semibold">{guardado}</p>
      )}
    </div>
  );
}
