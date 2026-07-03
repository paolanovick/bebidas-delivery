// src/pages/ConfiguracionHorarios.jsx
import React, { useState, useEffect } from "react";
import {
  obtenerConfiguracionHorarios,
  actualizarConfiguracionHorarios,
  getEnvioConfig,
  updateEnvioConfig,
} from "../services/api";

const ConfiguracionHorarios = () => {
  // HORARIOS
  const [config, setConfig] = useState({
    diasDisponibles: [],
    horaInicio: "09:00",
    horaFin: "20:00",
    duracionSlot: 60,
    diasAnticipacion: 0,
    pedidosSimultaneosPorSlot: 5,
    activo: true,
  });

  // ENVÍO
  const [configEnvio, setConfigEnvio] = useState({
    activo: true,
    costoEnvio: 0,
    montoMinimoEnvioGratis: 40000,
    mensaje: "",
    mensajeTicker: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Errores de horarios
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

  // CARGAR CONFIGURACIÓN (horarios + envío)
  useEffect(() => {
    const cargar = async () => {
      try {
        const dataHorarios = await obtenerConfiguracionHorarios();
        setConfig((prev) => ({
          ...prev,
          diasDisponibles: Array.isArray(dataHorarios?.diasDisponibles)
            ? dataHorarios.diasDisponibles
            : prev.diasDisponibles,
          horaInicio: dataHorarios?.horaInicio ?? prev.horaInicio,
          horaFin: dataHorarios?.horaFin ?? prev.horaFin,
          duracionSlot: dataHorarios?.duracionSlot ?? prev.duracionSlot,
          diasAnticipacion:
            dataHorarios?.diasAnticipacion ?? prev.diasAnticipacion,
          pedidosSimultaneosPorSlot:
            dataHorarios?.pedidosSimultaneosPorSlot ??
            prev.pedidosSimultaneosPorSlot,
          activo: dataHorarios?.activo ?? prev.activo,
        }));
        const dataEnvio = await getEnvioConfig();
        setConfigEnvio({
          activo:
            dataEnvio.envioHabilitado ??
            dataEnvio.activo ??
            dataHorarios?.envioHabilitado ??
            true,
          costoEnvio: dataEnvio.costoEnvio ?? dataHorarios?.costoEnvio ?? 0,
          montoMinimoEnvioGratis:
            dataEnvio.montoMinimoEnvioGratis ??
            dataHorarios?.montoMinimoEnvioGratis ??
            40000,
          mensaje: dataEnvio.mensaje || dataHorarios?.mensaje || "",
          mensajeTicker:
            dataEnvio.mensajeTicker || dataHorarios?.mensajeTicker || "",
        });
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      }
    };
    cargar();
  }, []);

  // ==================== HORARIOS ====================

  const handleDiaToggle = (dia) => {
    setConfig((prev) => ({
      ...prev,
      diasDisponibles: prev.diasDisponibles.includes(dia)
        ? prev.diasDisponibles.filter((d) => d !== dia)
        : [...prev.diasDisponibles, dia],
    }));
  };

  const formatearHora = (valorCrudo) => {
    if (!valorCrudo) return null;

    let v = String(valorCrudo).trim();
    if (!v) return null;

    v = v.replace(/[.,]/g, ":");

    if (/^\d{1,2}$/.test(v)) {
      const h = parseInt(v, 10);
      if (isNaN(h) || h < 0 || h > 23) return null;
      return `${h.toString().padStart(2, "0")}:00`;
    }

    if (/^\d{1,2}:[0-5]\d$/.test(v)) {
      const [hStr, mStr] = v.split(":");
      const h = parseInt(hStr, 10);
      if (isNaN(h) || h < 0 || h > 23) return null;
      return `${h.toString().padStart(2, "0")}:${mStr}`;
    }

    if (/^\d{3,4}$/.test(v)) {
      const soloNums = v;
      const minsPart = soloNums.slice(-2);
      const hourPart = soloNums.slice(0, soloNums.length - 2);
      const h = parseInt(hourPart, 10);
      const m = parseInt(minsPart, 10);

      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        return null;
      }

      return `${h.toString().padStart(2, "0")}:${minsPart}`;
    }

    return null;
  };

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

  // ==================== ENVÍO ====================

  const handleEnvioChange = (campo, valor) => {
    const camposNumericos = ["costoEnvio", "montoMinimoEnvioGratis"];

    setConfigEnvio((prev) => ({
      ...prev,
      [campo]: camposNumericos.includes(campo) ? parseFloat(valor) || 0 : valor,
    }));
  };

  // ==================== GUARDAR TODO ====================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    // Validar y normalizar horarios
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
      // Guardar horarios
      await actualizarConfiguracionHorarios(configNormalizado);

      // Guardar envío
      const dataEnvioGuardado = await updateEnvioConfig({
        activo: configEnvio.activo,
        envioHabilitado: configEnvio.activo,
        costoEnvio: configEnvio.costoEnvio,
        montoMinimoEnvioGratis: configEnvio.montoMinimoEnvioGratis,
        mensaje: configEnvio.mensaje,
        mensajeTicker: configEnvio.mensajeTicker,
      });

      const envioGuardado = dataEnvioGuardado?.config || dataEnvioGuardado;
      setConfigEnvio((prev) => ({
        ...prev,
        activo:
          envioGuardado?.envioHabilitado ??
          envioGuardado?.activo ??
          configEnvio.activo,
        costoEnvio: envioGuardado?.costoEnvio ?? configEnvio.costoEnvio,
        montoMinimoEnvioGratis:
          envioGuardado?.montoMinimoEnvioGratis ??
          configEnvio.montoMinimoEnvioGratis,
        mensaje: envioGuardado?.mensaje ?? configEnvio.mensaje,
        mensajeTicker:
          envioGuardado?.mensajeTicker ?? configEnvio.mensajeTicker,
      }));
      setConfig(configNormalizado);
      setMensaje("✅ Sus cambios fueron guardados con éxito");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje("❌ Error al actualizar configuración");
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
        ⏰ Configuración de Horarios y Envíos
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
        {/* ========================= SECCIÓN HORARIOS ========================= */}
        <div className="border-b-2 border-[#CDC7BD] pb-6">
          <h3 className="text-lg font-bold text-[#590707] mb-4">
            📅 Configuración de Horarios de Entrega
          </h3>

          {/* Activo / inactivo */}
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="activo"
              checked={config.activo}
              onChange={(e) =>
                setConfig({ ...config, activo: e.target.checked })
              }
              className="w-5 h-5 text-[#590707] focus:ring-[#A30404]"
            />
            <label htmlFor="activo" className="text-[#04090C] font-semibold">
              Sistema de horarios activo
            </label>
          </div>

          {/* Días disponibles */}
          <div className="mb-4">
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

          {/* Rango de horario */}
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
                <p className="mt-1 text-xs text-red-600">
                  {errores.horaInicio}
                </p>
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
        </div>

        {/* ========================= SECCIÓN ENVÍO ========================= */}
        <div className="border-b-2 border-[#CDC7BD] pb-6">
          <h3 className="text-lg font-bold text-[#590707] mb-4">
            🚚 Configuración de Envíos / Delivery
          </h3>

          {/* Activar/Desactivar envíos */}
          <div className="mb-4 p-4 bg-[#F2ECE4] rounded-lg border-2 border-[#CDC7BD]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={configEnvio.activo}
                onChange={(e) => handleEnvioChange("activo", e.target.checked)}
                className="w-6 h-6 cursor-pointer accent-[#590707]"
              />
              <span className="font-bold text-lg text-[#590707]">
                {configEnvio.activo
                  ? "✅ ENVÍOS HABILITADOS"
                  : "❌ ENVÍOS DESHABILITADOS"}
              </span>
            </label>
            <p className="text-sm text-[#736D66] mt-2 ml-9">
              Activa esto para permitir que los clientes realicen pedidos con
              envío
            </p>
          </div>

          {/* Costo del envío */}
          <div className="mb-4">
            <label className="font-bold text-[#590707] block mb-2 text-lg">
              💵 Costo del Envío ($)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-[#590707]">$</span>
              <input
                type="number"
                value={configEnvio.costoEnvio}
                onChange={(e) =>
                  handleEnvioChange("costoEnvio", e.target.value)
                }
                placeholder="0.00"
                step="0.01"
                min="0"
                className="flex-1 p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] placeholder-gray-400 font-semibold text-lg"
              />
            </div>
            <p className="text-sm text-[#736D66] mt-2">
              Este monto se sumará al total del pedido si el cliente selecciona
              envío
            </p>
          </div>

          {/* Monto envío gratis */}
          <div className="mb-4">
            <label className="font-bold text-[#590707] block mb-2 text-lg">
              🎁 Envío Gratis desde ($)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-[#590707]">$</span>
              <input
                type="number"
                value={configEnvio.montoMinimoEnvioGratis}
                onChange={(e) =>
                  handleEnvioChange("montoMinimoEnvioGratis", e.target.value)
                }
                placeholder="59000"
                step="100"
                min="0"
                className="flex-1 p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] placeholder-gray-400 font-semibold text-lg"
              />
            </div>
            <p className="text-sm text-[#736D66] mt-2">
              Si el subtotal llega a este monto, el envío se calcula en $0
              automáticamente
            </p>
          </div>

          {/* Mensaje personalizado
          <div className="mb-4">
            <label className="font-bold text-[#590707] block mb-2 text-lg">
              📝 Mensaje para el Cliente
            </label>
            <textarea
              value={configEnvio.mensaje}
              onChange={(e) => handleEnvioChange("mensaje", e.target.value)}
              placeholder="Ej: Enviamos de lunes a viernes entre las 19:00 y las 03:00"
              className="w-full p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] placeholder-gray-400 min-h-20 font-medium"
            />
            <p className="text-sm text-[#736D66] mt-2">
              Este mensaje se mostrará en el carrito cuando el cliente
              seleccione envío a domicilio
            </p>
          </div> */}

          {/* Mensaje del ticker */}
          <div className="mb-4">
            <label className="font-bold text-[#590707] block mb-2 text-lg">
              🎯 Mensaje del Banner Corredor
            </label>
            <input
              type="text"
              value={configEnvio.mensajeTicker}
              onChange={(e) =>
                handleEnvioChange("mensajeTicker", e.target.value)
              }
              placeholder="Ej: 📦 Envío gratis en compras mayores al monto configurado"
              className="w-full p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] placeholder-gray-400 font-medium"
            />
            <p className="text-sm text-[#736D66] mt-2">
              Este mensaje aparecerá en el banner que corre debajo del navbar
            </p>
          </div>

          {/* Vista previa envío */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h4 className="font-bold text-[#590707] mb-2">📊 Vista previa:</h4>
            <div className="space-y-2 text-sm text-[#736D66]">
              <p>
                • Estado:{" "}
                <span className="font-bold text-[#590707]">
                  {configEnvio.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              </p>
              <p>
                • Costo:{" "}
                <span className="font-bold text-[#590707]">
                  ${parseFloat(configEnvio.costoEnvio || 0).toFixed(2)}
                </span>
              </p>
              <p>
                • Gratis desde:{" "}
                <span className="font-bold text-[#590707]">
                  $
                  {parseFloat(
                    configEnvio.montoMinimoEnvioGratis || 0
                  ).toFixed(2)}
                </span>
              </p>
              <p>
                • Banner:{" "}
                <span className="font-bold text-[#590707]">
                  {configEnvio.mensajeTicker || "Sin mensaje personalizado"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ========================= BOTÓN GUARDAR ========================= */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#590707] hover:bg-[#A30404] text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-[#736D66] shadow-lg"
        >
          {loading ? "Guardando..." : "💾 Guardar Toda la Configuración"}
        </button>
      </form>

      {/* Información importante */}
      <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <h3 className="font-bold text-[#590707] mb-2 text-lg">
          ⚠️ Importante:
        </h3>
        <ul className="text-sm text-[#736D66] space-y-1">
          <li>
            ✓ Los cambios en horarios afectan solo los mensajes informativos
          </li>
          <li>
            ✓ Si desactivas los envíos, los clientes NO verán opción de entrega
          </li>
          <li>
            ✓ Si activas envíos, el costo se sumará automáticamente al total del
            pedido
          </li>
          <li>
            ✓ El mensaje se muestra en tiempo real en el carrito del cliente
          </li>
          <li>✓ Los cambios se guardan en la base de datos inmediatamente</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfiguracionHorarios;
