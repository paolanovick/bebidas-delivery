export default function ProductoCard({ producto, fmt, handleAgregar }) {
  return (
    <div className="relative bg-white rounded-xl border p-4 shadow-sm hover:shadow-xl transition w-full flex flex-col">
      {producto.stock <= 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
          SIN STOCK
        </div>
      )}

      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-40 object-contain rounded-lg mb-2"
        onError={(e) =>
          (e.target.src = "https://placehold.co/400x300?text=Sin+Imagen")
        }
      />

      <h3 className="text-lg font-semibold line-clamp-2 text-[#04090C]">
        {producto.nombre}
      </h3>

      <p className="text-[#736D66] text-sm line-clamp-2 mb-2">
        {producto.descripcion}
      </p>

      <p className="text-[#590707] font-bold text-xl mb-3">
        ${fmt(producto.precio)}
      </p>

      <button
        disabled={producto.stock <= 0}
        onClick={() => handleAgregar(producto)}
        className={`w-full py-2 rounded-lg font-semibold mt-auto ${
          producto.stock <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#590707] hover:bg-[#A30404] text-white"
        }`}
      >
        {producto.stock <= 0 ? "Sin stock" : "Agregar 🛒"}
      </button>
    </div>
  );
}
