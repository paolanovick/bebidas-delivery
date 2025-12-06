// ===============================
//  MenuBebidas.jsx - VERSIÓN FINAL
// ===============================

import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import CarruselDestacados from "../components/CarruselDestacados";

import { obtenerConfiguracionHorarios } from "../services/api";
import { getEstadoDelivery } from "../utils/horariosDelivery";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  const [categoria, setCategoria] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [tipo, setTipo] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [estadoDelivery, setEstadoDelivery] = useState(null);
  const [cargandoHorarios, setCargandoHorarios] = useState(true);

  const sinFiltros =
    categoria === "Todas" &&
    subcategoria === "Todas" &&
    tipo === "Todas" &&
    busqueda.trim() === "";

  // ============================================
  // 🔥 CATEGORÍAS OFICIALES (fijas)
  // ============================================
  const categorias = [
    "Todas",
    "Combos",
    "Cervezas",
    "Vinos",
    "Aperitivos y Licores",
    "Destilados",
    "Gaseosas y jugos",
    "Energizantes",
    "Snacks",
    "Ofertas",
    "Cigarrillos",
  ];

  // ============================================
  // SUBCATEGORÍAS DEFINIDAS
  // ============================================
  const subcategoriasMapa = {
    Vinos: ["Todas", "Tinto", "Blanco", "Rosado"],
    Destilados: ["Todas", "Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  };

  // TIPOS EXCLUSIVOS PARA WHISKY
  const tiposWhisky = ["Todas", "Bourbon", "Scotch", "Irish"];

  // ============================================
  // AGRUPACIÓN PARA CATÁLOGO NETFLIX
  // ============================================
  const bebidasPorCategoria = bebidas.reduce((acc, b) => {
    const principal =
      Array.isArray(b.categorias) && b.categorias.length > 0
        ? b.categorias[0]
        : b.categoria || "Sin categoría";

    if (!acc[principal]) acc[principal] = [];
    acc[principal].push(b);

    return acc;
  }, {});

  const ordenCategoriasCatalogo = categorias.filter(
    (c) => c !== "Todas" && bebidasPorCategoria[c]
  );

  // ============================================
  // FILTRO PRINCIPAL
  // ============================================
  const bebidasFiltradas = bebidas.filter((b) => {
    let categoriasProducto = [];

    if (Array.isArray(b.categorias) && b.categorias.length > 0) {
      categoriasProducto = b.categorias;
    } else if (b.categoria) {
      categoriasProducto = [b.categoria];
    }

    const matchCategoria =
      categoria === "Todas" ||
      categoriasProducto.some(
        (cat) => cat.toLowerCase() === categoria.toLowerCase()
      );

    const matchSubcategoria =
      subcategoria === "Todas" ||
      (b.subcategoria && b.subcategoria === subcategoria);

    const matchTipoWhisky =
      categoria === "Destilados" &&
      subcategoria === "Whisky" &&
      tipo !== "Todas"
        ? b.subcategoria === tipo
        : true;

    const q = busqueda.toLowerCase();
    const matchTxt =
      !q ||
      (b.nombre || "").toLowerCase().includes(q) ||
      (b.descripcion || "").toLowerCase().includes(q);

    return matchCategoria && matchSubcategoria && matchTipoWhisky && matchTxt;
  });

  // ============================================
  // PRODUCTOS DESTACADOS
  // ============================================
  const productosEstrella = bebidas.filter((b) => b.esEstrella);

  // ============================================
  // CARRITO
  // ============================================
  const [mensajeAgregado, setMensajeAgregado] = useState("");
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

  const handleAgregar = (b) => {
    if (!b.stock || b.stock <= 0) {
      setMensajeAgregado(`❗ "${b.nombre}" está sin stock`);
      setTimeout(() => setMensajeAgregado(""), 3000);
      return;
    }

    agregar(b);
    setMensajeAgregado(`"${b.nombre}" agregado 🛒`);
    setTimeout(() => setMensajeAgregado(""), 3000);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

  // ============================================
  // HORARIOS DELIVERY
  // ============================================
  useEffect(() => {
    const cargarEstado = async () => {
      try {
        const config = await obtenerConfiguracionHorarios();
        const estado = getEstadoDelivery(config);
        setEstadoDelivery(estado);
      } catch (err) {
        console.error("Error horarios:", err);
      } finally {
        setCargandoHorarios(false);
      }
    };
    cargarEstado();
  }, []);

  // ============================================
  // CARRUSEL DESTACADOS AUTOSCROLL
  // ============================================
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

  // ===========================================================
  // ===================== RENDER ==============================
  // ===========================================================
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
      {/* MENSAJE CARRITO */}
      {mensajeAgregado && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg">
          {mensajeAgregado}
        </div>
      )}

      {/* OVERLAY MOVIL */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* -------------------- SIDEBAR -------------------- */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#CDC7BD]
          p-6 z-40 shadow transform transition-transform duration-300
          pt-16 md:pt-6
          ${
            menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
          overflow-y-auto max-h-screen`}
      >
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
              className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] bg-white text-[#04090C]"
              placeholder="Ej: Malbec, Gin, Ron..."
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
                    setTipo("Todas");
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

          {/* SUBCATEGORÍAS */}
          {subcategoriasMapa[categoria] && (
            <div>
              <label className="text-sm text-[#736D66] block mb-2">
                Subcategoría
              </label>

              <div className="space-y-2">
                {subcategoriasMapa[categoria].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSubcategoria(sub);
                      setTipo("Todas");
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition ${
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

          {/* TIPOS WHISKY */}
          {categoria === "Destilados" && subcategoria === "Whisky" && (
            <div>
              <label className="text-sm text-[#736D66] block mb-2">
                Tipo de Whisky
              </label>

              <div className="space-y-2">
                {tiposWhisky.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                      tipo === t
                        ? "border-[#590707] bg-[#590707] text-white shadow"
                        : "border-transparent hover:bg-[#CDC7BD]/40 text-[#04090C]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* -------------------- CONTENIDO PRINCIPAL -------------------- */}
      <main className="flex-1 p-3 sm:p-5 md:p-8 lg:p-10 overflow-x-hidden pt-16 md:pt-10">
        {/* HORARIO DELIVERY */}
        {!cargandoHorarios && estadoDelivery && (
          <div
            className={`mb-4 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-md 
            ${
              estadoDelivery.estado === "durante"
                ? "bg-[#590707] text-white"
                : estadoDelivery.estado === "antes"
                ? "bg-[#590707] text-white"
                : "bg-[#736D66] text-white"
            }`}
          >
            <span className="text-xl">🛵</span>
            <p>{estadoDelivery.mensaje}</p>
          </div>
        )}

        {/* DESTACADOS */}
        {productosEstrella.length > 0 && (
          <CarruselDestacados
            productos={productosEstrella}
            handleAgregar={handleAgregar}
            scrollCarousel={(dir) => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({
                  left: dir === "left" ? -300 : 300,
                  behavior: "smooth",
                });
              }
            }}
            carouselRef={carouselRef}
            paused={paused}
            setPaused={setPaused}
            fmt={fmt}
          />
        )}

        {/* TÍTULO */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#590707]">
            Catálogo de Bebidas
          </h1>

          <button
            onClick={() => setMenuAbierto(true)}
            className="md:hidden bg-[#590707] text-white px-3 py-2 rounded-lg shadow-lg font-semibold"
          >
            Categorías ☰
          </button>
        </div>

        {/* SIN RESULTADOS */}
        {bebidasFiltradas.length === 0 ? (
          <p className="text-center text-[#736D66] text-lg mt-10">
            No se encontraron productos con ese filtro.
          </p>
        ) : sinFiltros ? (
          // =============================
          //   VISTA NETFLIX
          // =============================
          <div className="space-y-10">
            {ordenCategoriasCatalogo.map((cat) => (
              <section key={cat} className="w-full">
                <h2
                  className="text-xl md:text-2xl font-bold mb-3 text-[#590707] cursor-pointer"
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {bebidasPorCategoria[cat].map((b) => (
                    <div
                      key={b._id}
                      className="relative bg-white rounded-xl border border-[#CDC7BD] p-3 shadow-sm hover:shadow-xl transition hover:-translate-y-1 w-48 sm:w-56 md:w-64 flex-shrink-0"
                    >
                      {b.stock <= 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                          SIN STOCK
                        </div>
                      )}

                      <img
                        src={b.imagen}
                        alt={b.nombre}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/400x300/ccc/000?text=Sin+Imagen")
                        }
                      />

                      <h3 className="text-sm font-semibold text-[#04090C] line-clamp-2">
                        {b.nombre}
                      </h3>

                      <p className="text-[#736D66] text-xs line-clamp-2 mb-1">
                        {b.descripcion}
                      </p>

                      <p className="text-[#590707] font-bold text-lg mb-2">
                        ${fmt(b.precio)}
                      </p>

                      <button
                        onClick={() => handleAgregar(b)}
                        className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-1.5 rounded-lg font-semibold"
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
          // =============================
          //   VISTA FILTRADA
          // =============================
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bebidasFiltradas.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl border border-[#CDC7BD] p-4 shadow-sm hover:shadow-xl transition flex flex-col"
              >
                <img
                  src={b.imagen}
                  alt={b.nombre}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/400x300/ccc/000?text=Sin+Imagen")
                  }
                />

                <h3 className="text-lg font-semibold text-[#04090C] line-clamp-2">
                  {b.nombre}
                </h3>

                <p className="text-[#736D66] text-sm line-clamp-2 mb-2">
                  {b.descripcion}
                </p>

                <p className="text-[#590707] font-bold text-xl mb-3">
                  ${fmt(b.precio)}
                </p>

                <button
                  onClick={() => handleAgregar(b)}
                  className="bg-[#590707] hover:bg-[#A30404] text-white py-2 rounded-lg font-semibold"
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
