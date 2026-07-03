export default function ProductoCardCarrusel({
  producto,
  fmt,
  handleAgregar,
  respetarStock = true,
}) {
  const sinStock = Number(producto.stock) <= 0;
  const bloquearPorStock = respetarStock && sinStock;
  const cats = Array.isArray(producto.categorias)
    ? producto.categorias
    : producto.categoria
    ? [producto.categoria]
    : [];

  return (
    <div
      className="relative bg-white rounded-xl border border-[#CDC7BD] p-3 md:p-4 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-56 sm:w-64 md:w-72 flex-shrink-0"
      data-product-card
    >
      <div className="relative mb-3 md:mb-4">
        {/* CINTA DESTACADO - Solo si esEstrella es true */}
        {producto.esEstrella && (
          <div className="absolute left-0 top-2 px-3 py-1 bg-gradient-to-r from-[#A30404] to-[#590707] text-white text-[10px] md:text-xs font-bold uppercase shadow-md -rotate-6 origin-left pointer-events-none">
            Destacado
          </div>
        )}
        {/* CINTA SIN STOCK */}
        {sinStock && (
          <div className="absolute right-0 top-2 px-3 py-1 bg-gray-800 text-white text-[10px] md:text-xs font-bold uppercase shadow-md rotate-6 origin-right pointer-events-none">
            Sin Stock
          </div>
        )}

        <img
          src={producto.imagen}
          alt={producto.nombre}
          data-product-image
          className="w-full h-24 sm:h-32 md:h-40 object-contain rounded-lg mt-4" /* ✅ Cambiar object-cover por object-contain */
          onError={(e) =>
            (e.target.src = "https://placehold.co/400x300?text=Sin+Imagen")
          }
        />
      </div>

      {/* TEXTO + BADGES */}
      <div className="flex flex-col gap-1 md:gap-1.5">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#04090C] line-clamp-2">
          {producto.nombre}
        </h3>

        {/* TODOS LOS BADGES EN UNA FRANJA */}
        <div className="flex flex-wrap items-center gap-1 mb-1">
          {cats.map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] md:text-xs bg-[#CDC7BD] text-[#04090C] px-1.5 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}

          {producto.subcategoria && (
            <span className="text-[10px] md:text-xs bg-[#590707] text-white px-1.5 py-0.5 rounded-full">
              {producto.subcategoria}
            </span>
          )}
        </div>

        <p className="text-[#736D66] text-xs md:text-sm line-clamp-3">
          {producto.descripcion}
        </p>
      </div>

      {/* PRECIO + BOTÓN */}
      <div className="mt-2 md:mt-3">
        <p className="text-[#590707] font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-2">
          ${fmt(producto.precio)}
        </p>

        <button
          onClick={(event) =>
            handleAgregar(
              producto,
              event.currentTarget.closest("[data-product-card]")
            )
          }
          disabled={bloquearPorStock}
          className={`w-full py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold transition text-xs sm:text-sm md:text-base ${
            bloquearPorStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#590707] hover:bg-[#A30404] text-white"
          }`}
        >
          {bloquearPorStock ? "Sin stock" : "Agregar 🛒"}
        </button>
      </div>
    </div>
  );
}
