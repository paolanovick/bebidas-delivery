import React, { useEffect, useState } from "react";
import { getEnvioConfig, updateEnvioConfig } from "../services/api";

export default function AdminEnvio() {
  const [activo, setActivo] = useState(false);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [guardado, setGuardado] = useState("");
  const [cargando, setCargando] = useState(true);

  // Cargar configuración actual
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getEnvioConfig();
        setActivo(data.activo || false);
        setCostoEnvio(data.costoEnvio || 0);
        setMensaje(data.mensaje || "");
      } catch (err) {
        console.error("Error cargando configuración de envío:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Guardar cambios
  const handleGuardar = async () => {
    try {
      await updateEnvioConfig({
        activo,
        costoEnvio: parseFloat(costoEnvio) || 0,
        mensaje,
      });
      setGuardado("✔ Cambios guardados correctamente");
      setTimeout(() => setGuardado(""), 3000);
    } catch (err) {
      console.error("Error guardando configuración:", err);
      setGuardado("❌ Error al guardar cambios");
    }
  };

  if (cargando) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg text-[#04090C]">
        <p className="text-center text-gray-600">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg text-[#04090C]">
      {/* TÍTULO */}
      <h2 className="text-3xl font-bold mb-8 text-[#590707]">
        📦 Configuración de Envíos / Delivery
      </h2>

      {/* SECCIÓN 1: ACTIVAR/DESACTIVAR ENVÍOS */}
      <div className="mb-8 p-4 bg-[#F2ECE4] rounded-lg border-2 border-[#CDC7BD]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="w-6 h-6 cursor-pointer accent-[#590707]"
          />
          <span className="font-bold text-lg text-[#590707]">
            {activo ? "✅ ENVÍOS HABILITADOS" : "❌ ENVÍOS DESHABILITADOS"}
          </span>
        </label>
        <p className="text-sm text-[#736D66] mt-2 ml-9">
          Activa esto para permitir que los clientes realicen pedidos con envío
        </p>
      </div>

      {/* SECCIÓN 2: COSTO DEL ENVÍO */}
      <div className="mb-8">
        <label className="font-bold text-[#590707] block mb-2 text-lg">
          💵 Costo del Envío ($)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-[#590707]">$</span>
          <input
            type="number"
            value={costoEnvio}
            onChange={(e) => setCostoEnvio(e.target.value)}
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

      {/* SECCIÓN 3: MENSAJE PERSONALIZADO */}
      <div className="mb-8">
        <label className="font-bold text-[#590707] block mb-2 text-lg">
          📝 Mensaje para el Cliente
        </label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Ej: Enviamos de lunes a viernes. Los pedidos se entregan entre las 19:00 y las 03:00"
          className="w-full p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] placeholder-gray-400 min-h-20 font-medium"
        />
        <p className="text-sm text-[#736D66] mt-2">
          Este mensaje se mostrará en el carrito cuando el cliente seleccione
          envío
        </p>
      </div>

      {/* SECCIÓN 4: RESUMEN */}
      <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-bold text-[#590707] mb-3 text-lg">
          📊 Resumen Actual:
        </h3>
        <div className="space-y-2 text-sm text-[#736D66]">
          <p>
            • Estado:{" "}
            <span className="font-bold text-[#590707]">
              {activo ? "ACTIVO" : "INACTIVO"}
            </span>
          </p>
          <p>
            • Costo:{" "}
            <span className="font-bold text-[#590707]">
              ${parseFloat(costoEnvio || 0).toFixed(2)}
            </span>
          </p>
          <p>
            • Mensaje:{" "}
            <span className="font-bold text-[#590707]">
              {mensaje || "Sin mensaje personalizado"}
            </span>
          </p>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleGuardar}
          className="bg-[#590707] hover:bg-[#A30404] text-white px-8 py-3 rounded-lg font-bold transition text-lg flex items-center gap-2"
        >
          💾 Guardar Cambios
        </button>
      </div>

      {/* MENSAJE DE CONFIRMACIÓN */}
      {guardado && (
        <p
          className={`font-semibold p-4 rounded-lg text-center ${
            guardado.includes("✔")
              ? "bg-green-100 text-green-800 border-2 border-green-300"
              : "bg-red-100 text-red-800 border-2 border-red-300"
          }`}
        >
          {guardado}
        </p>
      )}

      {/* INFORMACIÓN IMPORTANTE */}
      <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <h3 className="font-bold text-[#590707] mb-2 text-lg">
          ⚠️ Importante:
        </h3>
        <ul className="text-sm text-[#736D66] space-y-1">
          <li>
            ✓ Si desactivas los envíos, los clientes NO verán opción de entrega
          </li>
          <li>
            ✓ Si activas, el costo se sumará automáticamente al total del pedido
          </li>
          <li>
            ✓ El mensaje se muestra en tiempo real en el carrito del cliente
          </li>
          <li>✓ Los cambios se guardan en la base de datos inmediatamente</li>
        </ul>
      </div>
    </div>
  );
}
