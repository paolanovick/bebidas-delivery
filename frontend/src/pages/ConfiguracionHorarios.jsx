// src/pages/ConfiguracionHorarios.jsx
import React, { useState, useEffect } from "react";
import {
  obtenerConfiguracionHorarios,
  actualizarConfiguracionHorarios,
} from "../services/api";

const ConfiguracionHorarios = () => {
  const [config, setConfig] = useState({
    diasDisponibles: [],
    horaInicio: "09:00",
    horaFin: "20:00",
    duracionSlot: 60,
    diasAnticipacion: 0,
    pedidosSimultaneosPorSlot: 5,
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const diasSemana = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const data = await obtenerConfiguracionHorarios();

      setConfig((prev) => ({
        ...prev,
        ...data,
        diasDisponibles: Array.isArray(data?.diasDisponibles)
          ? data.diasDisponibles
          : prev.diasDisponibles,
      }));
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    }
  };

  const handleDiaToggle = (dia) => {
    setConfig((prev) => ({
      ...prev,
      diasDisponibles: prev.diasDisponibles.includes(dia)
        ? prev.diasDisponibles.filter((d) => d !== dia)
        : [...prev.diasDisponibles, dia],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await actualizarConfiguracionHorarios(config);
      setMensaje("Configuración actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje("Error al actualizar configuración");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-[#04090C] border-b border-[#CDC7BD] pb-3">
        ⏰ Configuración de Horarios de Entrega
      </h2>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            mensaje.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activo / inactivo */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="activo"
            checked={config.activo}
            onChange={(e) => setConfig({ ...config, activo: e.target.checked })}
            className="w-5 h-5 text-[#590707] focus:ring-[#A30404]"
          />
          <label htmlFor="activo" className="text-[#04090C] font-semibold">
            Sistema de horarios activo
          </label>
        </div>

        {/* Días disponibles */}
        <div>
          <label className="block text-[#04090C] font-semibold mb-3">
            Días con entregas:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {diasSemana.map((dia) => (
              <button
                key={dia.value}
                type="button"
                onClick={() => handleDiaToggle(dia.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  config.diasDisponibles.includes(dia.value)
                    ? "bg-[#590707] text-white shadow-md"
                    : "bg-[#CDC7BD] text-[#04090C] hover:bg-[#736D66] hover:text-white"
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rango de horario (inputs de texto, no time) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hora inicio */}
          <div>
            <label className="block text-[#04090C] font-semibold mb-2">
              Hora de inicio de entregas:
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="^([01]\\d|2[0-3]):[0-5]\\d$"
              placeholder="08:00"
              title="Usá el formato HH:MM (por ej. 08:00)"
              value={config.horaInicio}
              onChange={(e) =>
                setConfig({ ...config, horaInicio: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#590707] rounded-lg bg-white text-[#04090C] focus:ring-2 focus:ring-[#590707] focus:outline-none"
              required
            />
          </div>

          {/* Hora fin */}
          <div>
            <label className="block text-[#04090C] font-semibold mb-2">
              Hora de fin de entregas:
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="^([01]\\d|2[0-3]):[0-5]\\d$"
              placeholder="20:00"
              title="Usá el formato HH:MM (por ej. 20:00)"
              value={config.horaFin}
              onChange={(e) =>
                setConfig({ ...config, horaFin: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#590707] rounded-lg bg-white text-[#04090C] focus:ring-2 focus:ring-[#590707] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#590707] hover:bg-[#A30404] text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-[#736D66] shadow-lg"
        >
          {loading ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </form>

      {/* Vista previa */}
      <div className="mt-6 p-4 bg-[#CDC7BD] rounded-lg">
        <h3 className="font-semibold text-[#04090C] mb-2">📋 Vista previa:</h3>
        <ul className="text-sm text-[#04090C] space-y-1">
          <li>
            • Horario de hoy (si es día habilitado):{" "}
            <strong>
              {config.horaInicio} a {config.horaFin}
            </strong>
          </li>
          <li>
            • Días con entregas:{" "}
            {config.diasDisponibles.length > 0
              ? config.diasDisponibles.join(", ")
              : "Ninguno"}
          </li>
          <li className="text-xs text-[#736D66] mt-2">
            Esta configuración se usa solo para mostrar mensajes informativos en
            el menú (ej: “Hoy entregamos a partir de las 20:00 hs”). <br />
            La compra sigue habilitada siempre.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConfiguracionHorarios;
