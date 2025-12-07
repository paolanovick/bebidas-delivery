import ProductoCardCarrusel from "./ProductoCardCarrusel";

export default function SeccionCategoria({
  categoria,
  productos,
  handleAgregar,
  fmt,
  setCategoria,
}) {
  return (
    <section className="w-full overflow-hidden">
      <button
        onClick={() => setCategoria(categoria)}
        className="text-2xl font-bold text-[#590707] mb-4 hover:text-[#A30404] hover:underline transition cursor-pointer"
      >
        {categoria}
      </button>

      <div
        className="flex gap-3 overflow-hidden pb-3 w-full"
        style={{ overflowX: "auto", overflowY: "hidden" }}
      >
        {productos.map((producto) => (
          <ProductoCardCarrusel
            key={producto._id}
            producto={producto}
            fmt={fmt}
            handleAgregar={handleAgregar}
          />
        ))}
      </div>
    </section>
  );
}
