import { useCarrito } from "../context/CarritoContext";

export default function ProductoCard({
  producto,
  fmt,
  handleAgregar,
  respetarStock = true,
}) {
  const { carrito } = useCarrito();
  const obtenerId = (item) => item?._id || item?.id;
  const itemEnCarrito = carrito.find(
    (item) => obtenerId(item) === obtenerId(producto)
  );
  const stock = Number(producto.stock) || 0;
  const cantidadEnCarrito = Number(itemEnCarrito?.cantidad) || 0;
  const sinStock = stock <= 0;
  const stockCompleto =
    respetarStock && stock > 0 && cantidadEnCarrito >= stock;
  const bloquearPorStock = respetarStock && (sinStock || stockCompleto);
  const textoBoton = sinStock
    ? "Sin stock"
    : stockCompleto
    ? "Stock completo"
    : "Agregar 🛒";

  return (
    <div
      className="relative bg-white rounded-xl border p-4 shadow-sm hover:shadow-xl transition w-full flex flex-col"
      data-product-card
    >
      {sinStock && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
          SIN STOCK
        </div>
      )}

      <img
        src={producto.imagen}
        alt={producto.nombre}
        data-product-image
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
        disabled={bloquearPorStock}
        onClick={(event) =>
          handleAgregar(
            producto,
            event.currentTarget.closest("[data-product-card]")
          )
        }
        className={`w-full py-2 rounded-lg font-semibold mt-auto ${
          bloquearPorStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#590707] hover:bg-[#A30404] text-white"
        }`}
      >
        {textoBoton}
      </button>
    </div>
  );
}
