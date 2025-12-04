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

  // 👇 errores específicos de cada campo de hora
  const [errores, setErrores] = useState({
    horaInicio: "",
    horaFin: "",
  });

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

  // 🕒 Función para normalizar y validar una hora
  // Soporta:
  //  - "8"      -> "08:00"
  //  - "18"     -> "18:00"
  //  - "8:30"   -> "08:30"
  //  - "0830"   -> "08:30"
  // Devuelve "HH:MM" o null si es inválida
  const formatearHora = (valorCrudo) => {
    if (!valorCrudo) return null;

    let v = String(valorCrudo).trim();
    if (!v) return null;

    // reemplazo puntos/comas por :
    v = v.replace(/[.,]/g, ":");

    // si es solo HH
    if (/^\d{1,2}$/.test(v)) {
      const h = parseInt(v, 10);
      if (isNaN(h) || h < 0 || h > 23) return null;
      return `${h.toString().padStart(2, "0")}:00`;
    }

    // si viene HH:MM (permito H:MM también)
    if (/^\d{1,2}:[0-5]\d$/.test(v)) {
      const [hStr, mStr] = v.split(":");
      const h = parseInt(hStr, 10);
      if (isNaN(h) || h < 0 || h > 23) return null;
      return `${h.toString().padStart(2, "0")}:${mStr}`;
    }

    // si viene tipo 830 / 0830
    if (/^\d{3,4}$/.test(v)) {
      const soloNums = v;
      const minsPart = soloNums.slice(-2); // últimos 2 dígitos
      const hourPart = soloNums.slice(0, soloNums.length - 2);
      const h = parseInt(hourPart, 10);
      const m = parseInt(minsPart, 10);

      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        return null;
      }

      return `${h.toString().padStart(2, "0")}:${minsPart}`;
    }

    return null; // formato no reconocido
  };

  // cuando el usuario sale del campo (blur) normalizamos
  const handleHoraBlur = (campo) => (e) => {
    const valor = e.target.value;

    if (!valor.trim()) {
      setErrores((prev) => ({ ...prev, [campo]: "" }));
      return;
    }

    const normalizada = formatearHora(valor);

    if (!normalizada) {
      setErrores((prev) => ({
        ...prev,
        [campo]:
          "Ingresá una hora válida en formato HH:MM (por ej. 08:00, 830, 18).",
      }));
    } else {
      setConfig((prev) => ({ ...prev, [campo]: normalizada }));
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    // Normalizamos y validamos ambas horas antes de enviar
    const nuevoErrores = { horaInicio: "", horaFin: "" };
    const configNormalizado = { ...config };
    let esValido = true;

    ["horaInicio", "horaFin"].forEach((campo) => {
      const valor = config[campo] || "";
      const normalizada = formatearHora(valor);

      if (!normalizada) {
        nuevoErrores[campo] =
          "Ingresá una hora válida en formato HH:MM (por ej. 08:00, 830, 18).";
        esValido = false;
      } else {
        configNormalizado[campo] = normalizada;
      }
    });

    if (!esValido) {
      setErrores((prev) => ({ ...prev, ...nuevoErrores }));
      setLoading(false);
      return;
    }

    try {
      await actualizarConfiguracionHorarios(configNormalizado);
      setConfig(configNormalizado);
      setMensaje("Configuración actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje("Error al actualizar configuración");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const baseInputClass =
    "w-full px-3 py-2 border rounded-lg bg-white text-[#04090C] focus:ring-2 focus:outline-none";

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-[#04090C] border-b border-[#CDC7BD] pb-3">
        Configuración de Horarios de Entrega
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

        {/* Rango de horario (texto, totalmente controlado) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hora inicio */}
          <div>
            <label className="block text-[#04090C] font-semibold mb-2">
              Hora de inicio de entregas:
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="08:00"
              value={config.horaInicio}
              onChange={(e) => {
                setConfig({ ...config, horaInicio: e.target.value });
                if (errores.horaInicio) {
                  setErrores((prev) => ({ ...prev, horaInicio: "" }));
                }
              }}
              onBlur={handleHoraBlur("horaInicio")}
              className={`${baseInputClass} ${
                errores.horaInicio
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#590707] focus:ring-[#590707]"
              }`}
            />
            {errores.horaInicio ? (
              <p className="mt-1 text-xs text-red-600">{errores.horaInicio}</p>
            ) : (
              <p className="mt-1 text-xs text-[#736D66]">
                Ejemplo: 08:00, 8, 0830, 8:30
              </p>
            )}
          </div>

          {/* Hora fin */}
          <div>
            <label className="block text-[#04090C] font-semibold mb-2">
              Hora de fin de entregas:
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="20:00"
              value={config.horaFin}
              onChange={(e) => {
                setConfig({ ...config, horaFin: e.target.value });
                if (errores.horaFin) {
                  setErrores((prev) => ({ ...prev, horaFin: "" }));
                }
              }}
              onBlur={handleHoraBlur("horaFin")}
              className={`${baseInputClass} ${
                errores.horaFin
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#590707] focus:ring-[#590707]"
              }`}
            />
            {errores.horaFin ? (
              <p className="mt-1 text-xs text-red-600">{errores.horaFin}</p>
            ) : (
              <p className="mt-1 text-xs text-[#736D66]">
                Ejemplo: 20:00, 20, 2130, 21:30
              </p>
            )}
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
