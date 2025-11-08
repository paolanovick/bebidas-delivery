// src/pages/AdminPedidos.jsx
import React, { useEffect, useState } from "react";
import {
  getPedidos,
  eliminarPedido,
  eliminarTodosPedidos,
  actualizarEstadoPedido,
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
                <th className="py-3 px-4 border border-[#CDC7BD]">Cliente</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Email</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Teléfono</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Dirección</th>
                <th className="py-3 px-4 border border-[#CDC7BD]">Total</th>
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
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C] font-semibold">
                    {pedido.usuario?.nombre || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#590707]">
                    {pedido.usuario?.email || "Sin email"}
                  </td>
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C]">
                    {pedido.telefono || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66] text-sm">
                    {pedido.direccionEntrega || "N/A"}
                  </td>
                  <td className="py-3 px-4 border border-[#CDC7BD] font-bold text-[#590707]">
                    ${pedido.total?.toFixed(2) || "0.00"}
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
