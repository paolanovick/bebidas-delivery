// components/BebidasList.jsx
import React from "react";
import BebidasCard from "./BebidasCard";

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
    <div>
      <h3 className="text-2xl font-bold text-[#04090C] mb-4">
        Catálogo de Bebidas ({bebidas.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bebidas.map((bebida) => (
          <BebidasCard
            key={bebida._id}
            bebida={bebida}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BebidasList;
