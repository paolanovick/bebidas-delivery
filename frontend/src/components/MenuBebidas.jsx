import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import CarruselDestacados from "../components/CarruselDestacados";

// 🔹 NUEVO: importamos la API de horarios y el helper
import { obtenerConfiguracionHorarios } from "../services/api";
import { getEstadoDelivery } from "../utils/horariosDelivery";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  const [categoria, setCategoria] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // 🔹 NUEVO: estado para horarios
  const [configHorarios, setConfigHorarios] = useState(null);
  const [estadoDelivery, setEstadoDelivery] = useState(null);

  // ------------------------------------
  // FLAGS PARA VISTA NETFLIX / FILTRADA
  // ------------------------------------
  const sinFiltros =
    categoria === "Todas" && subcategoria === "Todas" && busqueda.trim() === "";

  // Agrupar bebidas por categoría
  const bebidasPorCategoria = bebidas.reduce((acc, b) => {
    let cat = "Sin categoría";

    if (Array.isArray(b.categorias) && b.categorias.length > 0) {
      cat = b.categorias[0];
    } else if (b.categoria) {
      cat = b.categoria;
    }

    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(b);

    return acc;
  }, {});

  // Ordenar categorías según el menú lateral
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

  const ordenCategoriasCatalogo = categorias.filter(
    (c) => c !== "Todas" && bebidasPorCategoria[c]
  );

  const subcategoriasVinos = ["Todas", "Tinto", "Blanco", "Rosé"];

  // ---------------------------
  // FILTROS
  // ---------------------------
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

  const [mensajeAgregado, setMensajeAgregado] = useState("");
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

  const handleAgregar = (b) => {
    agregar(b);
    setMensajeAgregado(`${b.nombre} agregado al carrito 🛒`);
    setTimeout(() => setMensajeAgregado(""), 3000);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

  const mostrarSubcategorias = categoria === "Vinos";

  // -------------------------------------
  // CARRUSEL DESTACADOS (YA LO TENÍAS)
  // -------------------------------------
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = setInterval(() => {
      if (!paused) {
        carousel.scrollLeft += 1;
        if (
          carousel.scrollLeft >=
          carousel.scrollWidth - carousel.clientWidth
        ) {
          carousel.scrollLeft = 0;
        }
      }
    }, 15);

    return () => clearInterval(interval);
  }, [paused]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // -------------------------------------
  // 🔹 NUEVO: cargar configuración de horarios
  // -------------------------------------
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const data = await obtenerConfiguracionHorarios();
        setConfigHorarios(data);
        const estado = getEstadoDelivery(data);
        setEstadoDelivery(estado);
      } catch (err) {
        console.error("Error al cargar configuración de horarios:", err);
      }
    };

    cargarHorarios();
  }, []);

  // -------------------------------------
  // RENDER
  // -------------------------------------
  return (
    <div
      className="flex min-h-screen relative"
      style={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* MENSAJE PRODUCTO AGREGADO */}
      {mensajeAgregado && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm sm:text-base">
          {mensajeAgregado}
        </div>
      )}

      {/* OVERLAY MOBILE */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#CDC7BD] 
        p-6 z-40 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transform transition-transform duration-300
        pt-16 md:pt-6
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
          {/* BUSCADOR */}
          <div>
            <label className="text-sm text-[#736D66] block mb-2">Buscar</label>
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] bg-white text-[#04090C] placeholder-[#736D66]/80"
              placeholder="Ej: Malbec, Whisky..."
            />
          </div>

          {/* CATEGORÍAS */}
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

          {/* SUBCATEGORÍAS VINOS */}
          {mostrarSubcategorias && (
            <div>
              <label className="text-sm text-[#736D66] block mb-2">
                Tipo de Vino
              </label>

              <div className="space-y-2">
                {subcategoriasVinos.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubcategoria(sub)}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition text-sm ${
                      subcategoria === sub
                        ? "border-[#590707] bg-[#590707] text-white shadow"
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
      <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-10 overflow-x-hidden pt-16 md:pt-10">
        {/* 🔹 NUEVO: BANNER DE HORARIOS DE ENTREGA */}
        {estadoDelivery && estadoDelivery.mensaje && (
          <div className="mb-4 p-3 rounded-lg bg-[#FFF4D6] border border-[#E6B800] text-sm text-[#5A4500]">
            {estadoDelivery.mensaje}
          </div>
        )}

        {/* DESTACADOS */}
        {productosEstrella.length > 0 && (
          <CarruselDestacados
            productos={productosEstrella}
            handleAgregar={handleAgregar}
            scrollCarousel={scrollCarousel}
            carouselRef={carouselRef}
            paused={paused}
            setPaused={setPaused}
            fmt={fmt}
          />
        )}

        {/* TÍTULO */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#590707] flex-1 text-left md:text-center">
            Catálogo de Bebidas
          </h1>

          <button
            onClick={() => setMenuAbierto(true)}
            className="md:hidden bg-[#590707] text-white px-3 py-2 rounded-lg shadow-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            Categorías ☰
          </button>
        </div>

        {/* SI NO HAY RESULTADOS */}
        {bebidasFiltradas.length === 0 ? (
          <p className="text-center text-[#736D66] text-lg md:text-xl mt-10">
            No se encontró esa categoría de bebidas.
          </p>
        ) : sinFiltros ? (
          /* VISTA 1 – ESTILO NETFLIX POR CATEGORÍA */
          <div className="space-y-10">
            {ordenCategoriasCatalogo.map((cat) => (
              <section key={cat} className="w-full">
                <h2
                  onClick={() => {
                    setCategoria(cat);
                    setSubcategoria("Todas");
                    setBusqueda("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="
                    text-xl md:text-2xl font-bold mb-3 text-[#590707] 
                    cursor-pointer 
                    relative inline-block
                    transition-all
                    group
                  "
                >
                  <span className="group-hover:text-[#A30404] transition-colors">
                    {cat}
                  </span>

                  <span
                    className="
                      absolute left-0 -bottom-1 h-[2px] w-0 
                      bg-gradient-to-r from-[#590707] via-[#A30404] to-[#CDC7BD]
                      rounded-full
                      transition-all duration-300 
                      group-hover:w-full
                    "
                  />

                  <span
                    className="
                      opacity-0 group-hover:opacity-100 
                      text-[#A30404] 
                      ml-2 
                      transition-opacity duration-300
                    "
                  >
                    →
                  </span>
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {bebidasPorCategoria[cat].map((b) => (
                    <div
                      key={b._id}
                      className="bg-white rounded-xl border border-[#CDC7BD] p-3 md:p-4 shadow-sm hover:shadow-xl transition hover:-translate-y-1 w-48 sm:w-56 md:w-64 flex-shrink-0 flex flex-col"
                    >
                      <img
                        src={b.imagen}
                        alt={b.nombre}
                        className="w-full h-32 sm:h-40 md:h-44 object-cover rounded-lg mb-2"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen")
                        }
                      />

                      <h3 className="text-sm md:text-base font-semibold text-[#04090C] line-clamp-2 mb-1">
                        {b.nombre}
                      </h3>

                      <p className="text-[#590707] font-bold text-lg mb-2">
                        ${fmt(b.precio)}
                      </p>

                      <button
                        onClick={() => handleAgregar(b)}
                        className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-1.5 rounded-lg font-semibold transition"
                      >
                        Agregar 🛒
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* VISTA 2 – CUANDO HAY FILTROS */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bebidasFiltradas.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl border border-[#CDC7BD] p-3 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col"
              >
                <img
                  src={b.imagen}
                  alt={b.nombre}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-2"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen")
                  }
                />

                <h3 className="text-sm md:text-lg font-semibold text-[#04090C] mb-1 line-clamp-2">
                  {b.nombre}
                </h3>

                <p className="text-[#590707] font-bold text-xl mb-2">
                  ${fmt(b.precio)}
                </p>

                <button
                  onClick={() => handleAgregar(b)}
                  className="bg-[#590707] hover:bg-[#A30404] text-white py-2 rounded-lg font-semibold transition"
                >
                  Agregar 🛒
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
