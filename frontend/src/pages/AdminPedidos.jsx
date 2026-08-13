// src/pages/AdminPedidos.jsx
import React, { useEffect, useState } from "react";
import {
  getPedidos,
  eliminarPedido,
  eliminarTodosPedidos,
  actualizarEstadoPedido,
  actualizarEstadoPago,
} from "../services/api";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const data = await getPedidos();
      console.log("📦 Pedidos recibidos:", data); // ✅ PARA DEBUG
      setPedidos(data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
      try {
        await eliminarPedido(id);
        setPedidos(pedidos.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Error al eliminar pedido:", err);
        alert("No se pudo eliminar el pedido.");
      }
    }
  };

  const handleEliminarTodos = async () => {
    if (
      window.confirm(
        "⚠️ ¿Seguro que deseas eliminar TODOS los pedidos? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await eliminarTodosPedidos();
        setPedidos([]);
        alert("✅ Todos los pedidos fueron eliminados");
      } catch (err) {
        console.error("Error al eliminar todos los pedidos:", err);
        alert("❌ No se pudieron eliminar todos los pedidos.");
      }
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      setPedidos(
        pedidos.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado del pedido.");
    }
  };

  const handleCambiarEstadoPago = async (pedido, nuevoEstadoPago) => {
    try {
      const data = await actualizarEstadoPago(pedido._id, nuevoEstadoPago);
      setPedidos((actuales) =>
        actuales.map((item) =>
          item._id === pedido._id
            ? {
                ...item,
                estadoPago: data.pedido.estadoPago,
                estado: data.pedido.estado,
              }
            : item
        )
      );
    } catch (err) {
      alert(err.message || "No se pudo actualizar el estado del pago.");
    }
  };

  const whatsappConfirmacion = (pedido) => {
    const telefono = String(pedido.telefono || "").replace(/\D/g, "");
    if (!telefono) return "#";
    const numero = telefono.startsWith("54") ? telefono : `54${telefono.replace(/^0/, "")}`;
    const texto = `Hola, confirmamos el pago de tu pedido #${pedido._id.slice(-6)} en El Danés. ¡Gracias!`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  };

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmado: "bg-blue-100 text-blue-800",
      enviado: "bg-purple-100 text-purple-800",
      entregado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  if (cargando)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-center text-[#736D66] text-xl">
          Cargando pedidos...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-[#A30404] text-white p-4 rounded-lg text-center">
        {error}
      </div>
    );

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <div className="flex justify-between items-center mb-6 border-b border-[#CDC7BD] pb-4">
        <h2 className="text-3xl font-bold text-[#04090C]">
          📦 Gestión de Pedidos ({pedidosFiltrados.length})
        </h2>
        <button
          onClick={handleEliminarTodos}
          className="bg-[#A30404] hover:bg-[#590707] text-white px-6 py-3 rounded-lg transition-colors shadow-lg font-semibold"
        >
          🗑️ Eliminar Todos
        </button>
      </div>

      {/* Filtro por estado */}
      <div className="mb-6">
        <label className="block text-[#04090C] font-semibold mb-2">
          Filtrar por estado:
        </label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-[#CDC7BD] rounded-lg px-4 py-2 bg-white text-[#04090C] focus:outline-none focus:ring-2 focus:ring-[#590707]"
        >
          <option value="todos">Todos los pedidos</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmado">Confirmados</option>
          <option value="enviado">Enviados</option>
          <option value="entregado">Entregados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="text-center text-[#736D66] bg-[#CDC7BD]/20 rounded-xl p-8">
          <p className="text-lg">No hay pedidos para mostrar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-[#CDC7BD]">
            <thead className="bg-[#590707] text-white">
              <tr>
                <th className="py-3 px-4 border border-[#CDC7BD]">ID</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Teléfono</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Dirección</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Productos</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Notas</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Total</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Pago</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Fecha</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Estado</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr
                  key={pedido._id}
                  className="hover:bg-[#CDC7BD]/30 transition-colors"
                >
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66] text-xs">
                    #{pedido._id.slice(-6)}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C]">
                    {pedido.telefono || "Sin teléfono"}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66] text-sm">
                    {pedido.direccionEntrega || "N/A"}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C] text-sm">
                    {pedido.items?.map((item, i) => (
                      <div key={i} className="mb-1">
                        {item.nombre} x{item.cantidad}
                      </div>
                    )) || "Sin items"}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66] text-xs max-w-xs truncate">
                    {pedido.notas || "-"}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] font-bold text-[#590707]">
                    ${pedido.total?.toFixed(2) || "0.00"}
                  </td>

                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C] text-sm min-w-[210px]">
                    <p className="font-semibold capitalize">
                      {pedido.metodoPago || "efectivo"}
                    </p>
                    {pedido.metodoPago === "transferencia" && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-[#736D66]">
                          {pedido.aliasPago || "eldanestandil"}
                        </p>
                        {pedido.comprobantePago?.base64 ? (
                          <a
                            href={pedido.comprobantePago.base64}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-blue-700 underline font-semibold"
                          >
                            Ver comprobante
                          </a>
                        ) : (
                          <p className="text-xs text-[#736D66]">Sin comprobante</p>
                        )}
                        <select
                          value={pedido.estadoPago || "pendiente"}
                          onChange={(e) =>
                            handleCambiarEstadoPago(pedido, e.target.value)
                          }
                          className="block w-full border border-[#736D66] rounded px-2 py-1 bg-white"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_revision">En revisión</option>
                          <option value="aprobado">Aprobado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                        {pedido.estadoPago === "aprobado" && pedido.telefono && (
                          <a
                            href={whatsappConfirmacion(pedido)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
                          >
                            Avisar por WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66] text-sm">
                    {new Date(pedido.fecha).toLocaleDateString("es-AR")}
                    <br />
                    {new Date(pedido.fecha).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD]">
                    <select
                      value={pedido.estado || "pendiente"}
                      onChange={(e) =>
                        handleCambiarEstado(pedido._id, e.target.value)
                      }
                      className={`border border-[#736D66] rounded-lg px-3 py-2 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#A30404] ${getEstadoColor(
                        pedido.estado
                      )}`}
                    >
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="confirmado">✅ Confirmado</option>
                      <option value="enviado">🚚 Enviado</option>
                      <option value="entregado">📦 Entregado</option>
                      <option value="cancelado">❌ Cancelado</option>
                    </select>
                  </td>
                  
                  <td className="py-3 px-4 border border-[#CDC7BD] text-center">
                    <button
                      onClick={() => handleEliminar(pedido._id)}
                      className="bg-[#A30404] hover:bg-[#590707] text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-md font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
