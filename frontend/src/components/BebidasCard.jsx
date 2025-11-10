// components/BebidasCard.jsx
import React from "react";

const BebidasCard = ({ bebida, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-2xl transition-all border border-[#CDC7BD] hover:border-[#A30404]">
      {bebida.imagen && (
        <div className="mb-4">
          <img
            src={bebida.imagen}
            alt={bebida.nombre}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/400x300/CDC7BD/04090C?text=Sin+Imagen";
            }}
          />
        </div>
      )}

      <h3 className="text-xl font-bold text-[#04090C] mb-2">{bebida.nombre}</h3>

      {bebida.descripcion && (
        <p className="text-[#736D66] mb-3 text-sm">{bebida.descripcion}</p>
      )}

      <p className="text-[#590707] font-semibold text-3xl mb-5 tracking-wide">
        ${new Intl.NumberFormat("es-AR").format(bebida.precio)}
      </p>

      {/* Botones de Editar / Eliminar solo si se usan acá */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onEdit(bebida)}
          className="flex-1 bg-[#CDC7BD] hover:bg-[#736D66] text-[#04090C] hover:text-white py-2 rounded-lg font-semibold transition-all shadow-md"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(bebida._id)}
          className="flex-1 bg-[#A30404] hover:bg-[#590707] text-white py-2 rounded-lg font-semibold transition-all shadow-md"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default BebidasCard;
