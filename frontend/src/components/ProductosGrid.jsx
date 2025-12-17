import ProductoCard from "./ProductoCard";

export default function ProductosGrid({ productos, fmt, handleAgregar }) {
  // ✅ ORDENAR PRODUCTOS
  const productosOrdenados = [...productos].sort((a, b) => {
    const ordenA = a.orden && a.orden >= 1 && a.orden <= 10 ? a.orden : 999;
    const ordenB = b.orden && b.orden >= 1 && b.orden <= 10 ? b.orden : 999;
    return ordenA - ordenB;
  });

  if (productos.length === 0) {
    return (
      <p className="text-center text-[#736D66] text-lg mt-10">
        No se encontraron productos con ese filtro.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-full overflow-hidden">
      {productosOrdenados.map((producto) => (
        <ProductoCard
          key={producto._id}
          producto={producto}
          fmt={fmt}
          handleAgregar={handleAgregar}
        />
      ))}
    </div>
  );
}
