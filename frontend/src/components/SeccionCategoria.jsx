import ProductoCardCarrusel from "./ProductoCardCarrusel";

export default function SeccionCategoria({
  categoria,
  productos,
  handleAgregar,
  fmt,
}) {
  return (
    <section className="w-full overflow-hidden">
      <h2
        className="text-xl md:text-2xl font-bold mb-3 text-[#590707] cursor-pointer hover:text-[#A30404] transition"
        onClick={() => {
          // Aquí se puede agregar lógica para hacer click en la categoría
        }}
      >
        {categoria}
      </h2>

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
