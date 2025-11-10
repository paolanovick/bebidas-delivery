// components/BebidasList.jsx
import React from "react";

const BebidasList = ({ bebidas, onEdit, onDelete }) => {
  if (bebidas.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-8 text-center border border-[#CDC7BD]">
        <p className="text-[#736D66] text-lg mb-4">
          No hay bebidas registradas todavía
        </p>
        <p className="text-[#04090C] font-semibold">
          ¡Agrega tu primera bebida usando el formulario de arriba!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-2xl font-bold text-[#04090C] mb-4">
        Catálogo de Bebidas ({bebidas.length})
      </h3>

      <table className="min-w-full bg-white border border-[#CDC7BD] rounded-xl shadow-lg text-[#04090C]">
        <thead className="bg-[#590707] text-white">
          <tr>
            <th className="py-3 px-4 text-left">Imagen</th>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Categoría</th>
            <th className="py-3 px-4 text-left">Precio</th>
            <th className="py-3 px-4 text-left">Stock</th>
            <th className="py-3 px-4 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {bebidas.map((b) => (
            <tr
              key={b._id}
              className="border-b hover:bg-[#F2ECE4] transition-colors"
            >
              <td className="py-3 px-4">
                <img
                  src={b.imagen}
                  alt={b.nombre}
                  className="w-14 h-14 object-cover rounded-lg border border-[#CDC7BD]"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/80x80/CDC7BD/04090C?text=Sin+Img";
                  }}
                />
              </td>

              <td className="py-3 px-4 font-semibold">{b.nombre}</td>
              <td className="py-3 px-4">{b.categoria}</td>
              <td className="py-3 px-4">${b.precio}</td>
              <td className="py-3 px-4">{b.stock ?? "-"}</td>

              <td className="py-3 px-4 flex gap-2">
                <button
                  onClick={() => onEdit(b)}
                  className="px-3 py-1 rounded-lg bg-[#590707] text-white hover:bg-[#A30404] transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(b._id)}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BebidasList;
