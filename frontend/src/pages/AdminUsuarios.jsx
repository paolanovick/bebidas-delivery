import React, { useEffect, useState } from "react";
import {
  getUsuariosConPedidos,
  eliminarHistorialUsuario,
} from "../services/api";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const data = await getUsuariosConPedidos();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarHistorial = async (usuarioId, nombreUsuario) => {
    if (
      !window.confirm(
        `¿Eliminar TODO el historial de pedidos de ${nombreUsuario}?`
      )
    ) {
      return;
    }

    try {
      await eliminarHistorialUsuario(usuarioId);
      cargarUsuarios();
      alert("Historial eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar historial");
    }
  };

  if (cargando)
    return <p className="text-center text-[#736D66]">Cargando usuarios...</p>;
  if (error) return <p className="text-center text-[#A30404]">{error}</p>;
  if (usuarios.length === 0)
    return (
      <p className="text-center text-[#736D66] bg-white rounded-xl shadow-md p-8">
        No hay usuarios registrados.
      </p>
    );

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#04090C]">
        Lista de Usuarios
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-[#CDC7BD]">
          <thead className="bg-[#590707] text-white">
            <tr>
              <th className="py-3 px-4 border border-[#CDC7BD]">Nombre</th>
              <th className="py-3 px-4 border border-[#CDC7BD]">Email</th>
              <th className="py-3 px-4 border border-[#CDC7BD]">Rol</th>
              <th className="py-3 px-4 border border-[#CDC7BD]">
                Total Pedidos
              </th>
              <th className="py-3 px-4 border border-[#CDC7BD]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario._id}
                className="hover:bg-[#CDC7BD] transition-colors"
              >
                <td className="py-3 px-4 border border-[#CDC7BD] text-[#04090C] font-medium">
                  {usuario.nombre}
                </td>
                <td className="py-3 px-4 border border-[#CDC7BD] text-[#736D66]">
                  {usuario.email}
                </td>
                <td className="py-3 px-4 border border-[#CDC7BD]">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      usuario.rol === "admin"
                        ? "bg-[#590707] text-white"
                        : "bg-[#CDC7BD] text-[#04090C]"
                    }`}
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td className="py-3 px-4 border border-[#CDC7BD]">
                  {usuario.pedidos && usuario.pedidos.length > 0 ? (
                    <details>
                      <summary className="cursor-pointer text-[#A30404] hover:text-[#590707] font-medium transition-colors">
                        {usuario.pedidos.length} pedido(s)
                      </summary>
                      <ul className="mt-2 text-sm space-y-1">
                        {usuario.pedidos.map((p, idx) => (
                          <li key={idx} className="text-[#736D66]">
                            • {p.items.length} items - ${p.total}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <span className="text-[#736D66]">Sin pedidos</span>
                  )}
                </td>
                <td className="py-3 px-4 border border-[#CDC7BD] text-center">
                  {usuario.pedidos && usuario.pedidos.length > 0 && (
                    <button
                      onClick={() =>
                        handleEliminarHistorial(usuario._id, usuario.nombre)
                      }
                      className="bg-[#A30404] hover:bg-[#590707] text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-md"
                    >
                      Eliminar Historial
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
