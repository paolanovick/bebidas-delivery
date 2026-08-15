import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductoCardCarrusel from "./ProductoCardCarrusel";

export default function SeccionCategoria({
  categoria,
  productos,
  handleAgregar,
  fmt,
  setCategoria,
  respetarStock = true,
}) {
  const carruselRef = useRef(null);

  const moverCarrusel = (direccion) => {
    const carrusel = carruselRef.current;
    if (!carrusel) return;
    carrusel.scrollBy({
      left: direccion === "left" ? -carrusel.clientWidth * 0.8 : carrusel.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const abrirCategoria = () => {
    setCategoria(categoria);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ ORDENAR PRODUCTOS: primero por orden (1-10), luego el resto
  const productosOrdenados = [...productos].sort((a, b) => {
    const ordenA = a.orden && a.orden >= 1 && a.orden <= 10 ? a.orden : 999;
    const ordenB = b.orden && b.orden >= 1 && b.orden <= 10 ? b.orden : 999;
    return ordenA - ordenB;
  });

  return (
    <section className="w-full overflow-hidden">
      <button
        onClick={abrirCategoria}
        className="text-2xl font-bold text-[#590707] mb-4 hover:text-[#A30404] hover:underline transition cursor-pointer"
      >
        {categoria}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => moverCarrusel("left")}
          aria-label={`Ver productos anteriores de ${categoria}`}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#590707] shadow-lg border border-[#CDC7BD]"
        >
          <ChevronLeft size={28} />
        </button>

        <div
          ref={carruselRef}
          className="destacados-scroll flex gap-3 overflow-hidden pb-3 w-full md:px-12"
          style={{ overflowX: "auto", overflowY: "hidden" }}
        >
          {productosOrdenados.map((producto) => (
            <ProductoCardCarrusel
              key={producto._id}
              producto={producto}
              fmt={fmt}
              handleAgregar={handleAgregar}
              respetarStock={respetarStock}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => moverCarrusel("right")}
          aria-label={`Ver más productos de ${categoria}`}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#590707] shadow-lg border border-[#CDC7BD]"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
