import React, { useState, useRef } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  const [categoria, setCategoria] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const carouselRef = useRef(null);

  const categorias = [
    "Todas",
    "Vinos",
    "Cervezas",
    "Gaseosas",
    "Jugos",
    "Espumantes",
    "Whisky",
    "Blancas",
    "Licores",
    "Aperitivos",
    "Energéticas",
    "Aguas",
    "Combos",
    "Mayoristas",
    "Ofertas",
    "Regalos",
    "Gift Cards",
    "Wine Club",
    "Experiencias",
  ];

  const subcategoriasVinos = ["Todas", "Tinto", "Blanco", "Rosé"];

  const bebidasFiltradas = bebidas.filter((b) => {
    let categoriasProducto = [];

    if (Array.isArray(b.categorias) && b.categorias.length > 0) {
      categoriasProducto = b.categorias;
    } else if (b.categoria) {
      categoriasProducto = [b.categoria];
    }

    const matchCat =
      categoria === "Todas" ||
      categoriasProducto.some(
        (cat) => cat.toLowerCase() === categoria.toLowerCase()
      );

    const matchSubcat =
      subcategoria === "Todas" ||
      !b.subcategoria ||
      b.subcategoria === subcategoria;

    const q = busqueda.toLowerCase();
    const matchTxt =
      !q ||
      (b.nombre || "").toLowerCase().includes(q) ||
      (b.descripcion || "").toLowerCase().includes(q);

    return matchCat && matchSubcat && matchTxt;
  });

  const productosEstrella = bebidas.filter((b) => b.esEstrella);

  const handleAgregar = (b) => {
    agregar(b);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

  const mostrarSubcategorias = categoria === "Vinos";

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F2]">
      {/* HAMBURGUESA MÓVIL */}
      <button
        onClick={() => setMenuAbierto(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-[#590707] text-white px-3 py-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* OVERLAY MOBILE */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* SIDEBAR IZQUIERDO */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#CDC7BD] p-6 z-40
  shadow-[0_8px_24px_rgba(0,0,0,0.08)] transform transition-transform duration-300
  ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  overflow-y-auto max-h-screen`}
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-[#CDC7BD]" />

        <button
          onClick={() => setMenuAbierto(false)}
          className="md:hidden ml-auto mb-4 text-[#590707] font-bold"
        >
          ✖
        </button>

        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#736D66] uppercase mb-1">
              Tienda
            </p>
            <h2 className="text-2xl font-semibold text-[#04090C]">Filtros</h2>
          </div>

          {/* Buscador */}
          <div>
            <label className="text-sm text-[#736D66] block mb-2">Buscar</label>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] bg-white text-[#04090C] placeholder-[#736D66]/80"
              placeholder="Ej: Malbec, Whisky..."
            />
          </div>

          {/* Categorías */}
          <div>
            <label className="text-sm text-[#736D66] block mb-2">
              Categorías
            </label>
            <div className="space-y-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoria(cat);
                    setSubcategoria("Todas");
                    setMenuAbierto(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                    categoria === cat
                      ? "border-[#590707] bg-[#590707] text-white shadow"
                      : "border-transparent hover:bg-[#CDC7BD]/40 text-[#04090C]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SUBCATEGORÍAS DE VINOS */}
          {mostrarSubcategorias && (
            <div>
              <label className="text-sm text-[#736D66] block mb-2">
                Tipo de Vino
              </label>
              <div className="space-y-2">
                {subcategoriasVinos.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSubcategoria(sub);
                      setMenuAbierto(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition text-sm ${
                      subcategoria === sub
                        ? "border-[#A30404] bg-[#A30404] text-white shadow"
                        : "border-transparent hover:bg-[#CDC7BD]/40 text-[#04090C]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        {/* SECCIÓN DESTACADOS */}
        {productosEstrella.length > 0 && (
          <section className="mb-8 md:mb-12 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#590707] mb-6 md:mb-8">
              DESTACADOS DE EL DANÉS
            </h2>

            {/* GRID RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12 w-full max-w-full">
              {productosEstrella.map((b) => {
                const cats =
                  Array.isArray(b.categorias) && b.categorias.length > 0
                    ? b.categorias
                    : b.categoria
                    ? [b.categoria]
                    : [];

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-xl md:rounded-2xl border border-[#CDC7BD] p-3 md:p-4 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-full"
                  >
                    <div>
                      <img
                        src={b.imagen}
                        alt={b.nombre || "Imagen de bebida"}
                        className="w-full h-40 md:h-48 object-cover rounded-xl mb-3 md:mb-4"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen";
                        }}
                      />

                      <h3 className="text-lg md:text-xl font-semibold text-[#04090C] mb-1 line-clamp-2">
                        {b.nombre}
                      </h3>

                      {cats.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {cats.map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-[#CDC7BD] text-[#04090C] px-2 py-1 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      {b.subcategoria && (
                        <span className="text-xs bg-[#A30404] text-white px-2 py-1 rounded-full inline-block mb-2">
                          {b.subcategoria}
                        </span>
                      )}

                      <p className="text-[#736D66] text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                        {b.descripcion}
                      </p>

                      <p className="text-[#590707] font-bold text-xl md:text-2xl mb-3 md:mb-4">
                        ${fmt(b.precio)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAgregar(b)}
                      className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-2 rounded-xl font-semibold transition mt-auto text-sm md:text-base"
                    >
                      Agregar al carrito 🛒
                    </button>
                  </div>
                );
              })}
            </div>

            {/* CAROUSEL RESPONSIVE */}
            <div className="relative mt-8 md:mt-12 w-full max-w-full overflow-hidden">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-[#590707] mb-4 md:mb-6">
                Más Destacados
              </h3>

              <div className="relative w-full">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#590707] p-2 rounded-full shadow-lg transition items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={carouselRef}
                  className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth px-1 md:px-4 lg:px-12 snap-x snap-mandatory scrollbar-hide w-full"
                >
                  {productosEstrella.map((b) => {
                    const cats =
                      Array.isArray(b.categorias) && b.categorias.length > 0
                        ? b.categorias
                        : b.categoria
                        ? [b.categoria]
                        : [];

                    return (
                      <div
                        key={`carousel-${b._id}`}
                        className="bg-white rounded-xl md:rounded-2xl border border-[#CDC7BD] p-3 md:p-4 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-64 md:w-72 flex-shrink-0 snap-start"
                      >
                        <div>
                          <img
                            src={b.imagen}
                            alt={b.nombre || "Imagen de bebida"}
                            className="w-full h-40 md:h-48 object-cover rounded-xl mb-3 md:mb-4"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen";
                            }}
                          />

                          <h3 className="text-lg md:text-xl font-semibold text-[#04090C] mb-1 line-clamp-2">
                            {b.nombre}
                          </h3>

                          {cats.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {cats.map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-[#CDC7BD] text-[#04090C] px-2 py-1 rounded-full"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}

                          {b.subcategoria && (
                            <span className="text-xs bg-[#A30404] text-white px-2 py-1 rounded-full inline-block mb-2">
                              {b.subcategoria}
                            </span>
                          )}

                          <p className="text-[#736D66] text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                            {b.descripcion}
                          </p>

                          <p className="text-[#590707] font-bold text-xl md:text-2xl mb-3 md:mb-4">
                            ${fmt(b.precio)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAgregar(b)}
                          className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-2 rounded-xl font-semibold transition mt-auto text-sm md:text-base"
                        >
                          Agregar al carrito 🛒
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => scrollCarousel("right")}
                  className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#590707] p-2 rounded-full shadow-lg transition items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="border-t-2 border-[#CDC7BD] mt-6 md:mt-8"></div>
          </section>
        )}

        {/* CATÁLOGO NORMAL */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#590707] mb-6 md:mb-8">
          Catálogo de Bebidas
        </h1>

        {bebidasFiltradas.length === 0 ? (
          <p className="text-center text-[#736D66] text-lg md:text-xl mt-10">
            No se encontraron bebidas con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full max-w-full">
            {bebidasFiltradas.map((b) => {
              const cats =
                Array.isArray(b.categorias) && b.categorias.length > 0
                  ? b.categorias
                  : b.categoria
                  ? [b.categoria]
                  : [];

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-xl md:rounded-2xl border border-[#CDC7BD] p-3 md:p-4 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-full"
                >
                  <div>
                    <img
                      src={b.imagen}
                      alt={b.nombre || "Imagen de bebida"}
                      className="w-full h-40 md:h-48 object-cover rounded-xl mb-3 md:mb-4"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen";
                      }}
                    />

                    <h3 className="text-lg md:text-xl font-semibold text-[#04090C] mb-1 line-clamp-2">
                      {b.nombre}
                    </h3>

                    {cats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cats.map((cat, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#CDC7BD] text-[#04090C] px-2 py-1 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {b.subcategoria && (
                      <span className="text-xs bg-[#A30404] text-white px-2 py-1 rounded-full inline-block mb-2">
                        {b.subcategoria}
                      </span>
                    )}

                    <p className="text-[#736D66] text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                      {b.descripcion}
                    </p>

                    <p className="text-[#590707] font-bold text-xl md:text-2xl mb-3 md:mb-4">
                      ${fmt(b.precio)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAgregar(b)}
                    className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-2 rounded-xl font-semibold transition mt-auto text-sm md:text-base"
                  >
                    Agregar al carrito 🛒
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
