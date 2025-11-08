import React, { useState, useEffect } from "react";
import {
  obtenerMisPedidos,
  eliminarPedido,
  eliminarTodosPedidos,
} from "../services/api";
import { Link } from "react-router-dom";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await obtenerMisPedidos();
      setPedidos(data);
    } catch (error) {
      setError("Error al cargar tus pedidos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await eliminarPedido(id);
      setPedidos(pedidos.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el pedido");
    }
  };

  const handleEliminarTodos = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar TODOS tus pedidos?"))
      return;
    try {
      await eliminarTodosPedidos();
      setPedidos([]);
    } catch (error) {
      console.error(error);
      alert("No se pudieron eliminar todos los pedidos");
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "bg-[#CDC7BD] text-[#04090C]",
      confirmado: "bg-[#736D66] text-[#FFFFFF]",
      enviado: "bg-[#590707] text-[#FFFFFF]",
      entregado: "bg-[#A30404] text-[#FFFFFF]",
      cancelado: "bg-[#04090C] text-[#CDC7BD]",
    };
    return colores[estado] || "bg-gray-100 text-gray-800";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-[#736D66]">Cargando tus pedidos...</div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-[#A30404] border border-[#590707] text-[#FFFFFF] px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-[#A30404]">
        Mis Pedidos
      </h1>

      {pedidos.length === 0 ? (
        <div className="bg-[#FFFFFF] shadow-lg rounded-xl p-8 text-center border border-[#CDC7BD]">
          <p className="text-xl text-[#736D66] mb-4">
            Aun no has realizado ningun pedido
          </p>
          <Link
            to="/tienda"
            className="bg-[#CDC7BD] hover:bg-[#A30404] text-[#04090C] hover:text-[#FFFFFF] px-6 py-3 rounded-xl font-semibold transition"
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <>
          <button
            onClick={handleEliminarTodos}
            className="bg-[#A30404] hover:bg-[#590707] text-[#FFFFFF] px-4 py-2 rounded mb-4 font-semibold shadow-md transition"
          >
            Eliminar Todos Mis Pedidos
          </button>

          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido._id}
                className="bg-[#FFFFFF] shadow-2xl rounded-2xl p-6 hover:shadow-[#736D66]/50 transition"
              >
                <div className="flex justify-between items-start mb-4 border-b border-[#CDC7BD] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#04090C] mb-2">
                      Pedido #{pedido._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-[#736D66]">
                      {formatearFecha(pedido.fecha)}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${getEstadoColor(
                      pedido.estado
                    )}`}
                  >
                    {pedido.estado.toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-[#590707] mb-3">
                    Productos:
                  </h4>
                  <div className="space-y-2">
                    {pedido.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-[#CDC7BD]/20 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.bebida?.imagen && (
                            <img
                              src={item.bebida.imagen}
                              alt={item.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-[#04090C]">
                              {item.nombre}
                            </p>
                            <p className="text-sm text-[#736D66]">
                              Cantidad: {item.cantidad}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-[#A30404]">
                          ${item.precio * item.cantidad}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#CDC7BD]/20 p-4 rounded mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-[#590707]">Dirección:</p>
                      <p className="text-[#04090C]">
                        {pedido.direccionEntrega}
                      </p>
                    </div>
                    {pedido.telefono && (
                      <div>
                        <p className="font-semibold text-[#590707]">
                          Teléfono:
                        </p>
                        <p className="text-[#04090C]">{pedido.telefono}</p>
                      </div>
                    )}
                  </div>
                  {pedido.notas && (
                    <div className="mt-3 pt-3 border-t border-[#736D66]/50">
                      <p className="font-semibold text-[#590707] text-sm mb-1">
                        Notas:
                      </p>
                      <p className="text-[#04090C] text-sm">{pedido.notas}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-[#CDC7BD]">
                  <span className="text-xl font-bold text-[#04090C]">
                    Total:
                  </span>
                  <span className="text-2xl font-extrabold text-[#A30404]">
                    ${pedido.total}
                  </span>
                </div>

                <button
                  onClick={() => handleEliminar(pedido._id)}
                  className="mt-4 bg-[#590707] hover:bg-[#A30404] text-[#FFFFFF] px-3 py-1 rounded-xl font-semibold shadow transition"
                >
                  Eliminar Pedido
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MisPedidos;
