import ProductoCardCarrusel from "./ProductoCardCarrusel";

export default function SeccionCategoria({
  categoria,
  productos,
  handleAgregar,
  fmt,
  setCategoria,
}) {
  // ✅ ORDENAR PRODUCTOS: primero por orden (1-10), luego el resto
  const productosOrdenados = [...productos].sort((a, b) => {
    const ordenA = a.orden && a.orden >= 1 && a.orden <= 10 ? a.orden : 999;
    const ordenB = b.orden && b.orden >= 1 && b.orden <= 10 ? b.orden : 999;
    return ordenA - ordenB;
  });

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
        {productosOrdenados.map((producto) => (
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
