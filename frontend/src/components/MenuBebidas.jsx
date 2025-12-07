// ===============================
//  MenuBebidas.jsx - VERSIÓN CORREGIDA
// ===============================

import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import CarruselDestacados from "../components/CarruselDestacados";
import Sidebar from "./Sidebar";
import { obtenerConfiguracionHorarios, getEnvioConfig } from "../services/api";
import { getEstadoDelivery } from "../utils/horariosDelivery";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  // ============================
  // ESTADOS
  // ============================
  const [categoria, setCategoria] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [tipo, setTipo] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [estadoDelivery, setEstadoDelivery] = useState(null);
  const [cargandoHorarios, setCargandoHorarios] = useState(true);

  const [envioConfig, setEnvioConfig] = useState(null);

  const [mensajeAgregado, setMensajeAgregado] = useState("");
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

  // ============================
  // CATEGORÍAS OFICIALES
  // ============================
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

  // ============================
  // SUBCATEGORÍAS
  // ============================
  const subcategoriasMapa = {
    Vinos: ["Todas", "Tinto", "Blanco", "Rosado"],
    Destilados: ["Todas", "Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  };

  const tiposWhisky = ["Todas", "Bourbon", "Scotch", "Irish"];

  // ============================
  // ENVÍOS CONFIGURACIÓN
  // ============================
  useEffect(() => {
    getEnvioConfig().then(setEnvioConfig);
  }, []);

  // ============================
  // FILTRO PRINCIPAL
  // ============================
  const bebidasFiltradas = bebidas.filter((b) => {
    const categoriasProducto = Array.isArray(b.categorias)
      ? b.categorias
      : b.categoria
      ? [b.categoria]
      : [];

    const matchCategoria =
      categoria === "Todas" ||
      categoriasProducto.some(
        (cat) => cat.toLowerCase() === categoria.toLowerCase()
      );

    const matchSubcategoria =
      subcategoria === "Todas" || b.subcategoria === subcategoria;

    const matchTipoWhisky =
      categoria === "Destilados" &&
      subcategoria === "Whisky" &&
      tipo !== "Todas"
        ? b.tipoWhisky === tipo
        : true;

    const q = busqueda.toLowerCase();
    const matchTexto =
      !q ||
      (b.nombre || "").toLowerCase().includes(q) ||
      (b.descripcion || "").toLowerCase().includes(q);

    return matchCategoria && matchSubcategoria && matchTipoWhisky && matchTexto;
  });

  // ============================
  // DESTACADOS
  // ============================
  const productosEstrella = bebidas.filter((b) => b.esEstrella);

  // ============================
  // CARRITO
  // ============================
  const handleAgregar = (b) => {
    if (!b.stock || b.stock <= 0) return;

    agregar(b);
    setMensajeAgregado(`"${b.nombre}" agregado 🛒`);
    setTimeout(() => setMensajeAgregado(""), 2500);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

  // ============================
  // HORARIOS DELIVERY
  // ============================
  useEffect(() => {
    const cargar = async () => {
      try {
        const config = await obtenerConfiguracionHorarios();
        setEstadoDelivery(getEstadoDelivery(config));
      } catch (err) {
        console.error(err);
      } finally {
        setCargandoHorarios(false);
      }
    };
    cargar();
  }, []);

  // ============================
  // AUTOSCROLL CARRUSEL
  // ============================
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

  const sinFiltros =
    categoria === "Todas" &&
    subcategoria === "Todas" &&
    tipo === "Todas" &&
    busqueda.trim() === "";

  // ============================
  // AGRUPAR CATEGORÍAS PARA ESTILO NETFLIX
  // ============================
  const bebidasPorCategoria = bebidas.reduce((acc, b) => {
    const principal = Array.isArray(b.categorias)
      ? b.categorias[0]
      : b.categoria || "Sin categoría";

    if (!acc[principal]) acc[principal] = [];
    acc[principal].push(b);

    return acc;
  }, {});

  const ordenCategoriasCatalogo = categorias.filter(
    (c) => c !== "Todas" && bebidasPorCategoria[c]
  );

  // ============================
  // RENDER
  // ============================
  return (
    <div
      className="flex min-h-screen relative overflow-x-hidden"
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

      {/* SIDEBAR */}
      <Sidebar
        categoria={categoria}
        setCategoria={setCategoria}
        subcategoria={subcategoria}
        setSubcategoria={setSubcategoria}
        tipo={tipo}
        setTipo={setTipo}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        categorias={categorias}
        subcategoriasMapa={subcategoriasMapa}
        tiposWhisky={tiposWhisky}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      {/* CONTENIDO */}
      <main className="flex-1 p-6 pt-20 md:pt-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* HORARIOS */}
        {!cargandoHorarios && estadoDelivery && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl shadow-md text-white flex items-center gap-3 ${
              estadoDelivery.estado === "despues"
                ? "bg-[#736D66]"
                : "bg-[#590707]"
            }`}
          >
            🛵 <p>{estadoDelivery.mensaje}</p>
          </div>
        )}

        {/* ENVÍOS */}
        {envioConfig?.activo && envioConfig?.mensaje && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#A30404] text-white shadow-md flex items-center gap-3">
            📦 <p>{envioConfig.mensaje}</p>
          </div>
        )}

        {/* DESTACADOS */}
        {productosEstrella.length > 0 && (
          <CarruselDestacados
            productos={productosEstrella}
            handleAgregar={handleAgregar}
            scrollCarousel={(dir) => {
              const c = carouselRef.current;
              if (c) {
                c.scrollBy({
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
        <h1 className="text-3xl md:text-4xl font-bold text-[#590707] mb-6">
          Catálogo de Bebidas
        </h1>

        {/* SI NO HAY RESULTADOS */}
        {bebidasFiltradas.length === 0 ? (
          <p className="text-center text-[#736D66] text-lg mt-10">
            No se encontraron productos con ese filtro.
          </p>
        ) : sinFiltros ? (
          // ============================
          // VISTA NETFLIX
          // ============================
          <div className="space-y-10">
            {ordenCategoriasCatalogo.map((cat) => (
              <section key={cat} className="w-full overflow-hidden">
                <h2
                  className="text-xl md:text-2xl font-bold mb-3 text-[#590707] cursor-pointer"
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </h2>

                <div
                  className="flex gap-3 overflow-hidden pb-3 w-full"
                  style={{ overflowX: "auto", overflowY: "hidden" }}
                >
                  {bebidasPorCategoria[cat].map((b) => (
                    <div
                      key={b._id}
                      className="relative bg-white rounded-xl border p-3 shadow-sm hover:shadow-xl transition w-48 sm:w-56 flex-shrink-0 min-w-48"
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
                          (e.target.src =
                            "https://placehold.co/400x300?text=Sin+Imagen")
                        }
                      />

                      <h3 className="text-sm font-semibold line-clamp-2 text-[#04090C]">
                        {b.nombre}
                      </h3>

                      <p className="text-[#736D66] text-xs line-clamp-2 mb-2">
                        {b.descripcion}
                      </p>

                      <p className="text-[#590707] font-bold text-lg mb-2">
                        ${fmt(b.precio)}
                      </p>

                      <button
                        disabled={b.stock <= 0}
                        onClick={() => handleAgregar(b)}
                        className={`w-full py-2 rounded-lg font-semibold ${
                          b.stock <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#590707] hover:bg-[#A30404] text-white"
                        }`}
                      >
                        {b.stock <= 0 ? "Sin stock" : "Agregar 🛒"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // ============================
          // VISTA FILTRADA
          // ============================
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-full overflow-hidden">
            {bebidasFiltradas.map((b) => (
              <div
                key={b._id}
                className="relative bg-white rounded-xl border p-4 shadow-sm hover:shadow-xl transition w-full"
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
                    (e.target.src =
                      "https://placehold.co/400x300?text=Sin+Imagen")
                  }
                />

                <h3 className="text-lg font-semibold line-clamp-2 text-[#04090C]">
                  {b.nombre}
                </h3>

                <p className="text-[#736D66] text-sm line-clamp-2 mb-2">
                  {b.descripcion}
                </p>

                <p className="text-[#590707] font-bold text-xl mb-3">
                  ${fmt(b.precio)}
                </p>

                <button
                  disabled={b.stock <= 0}
                  onClick={() => handleAgregar(b)}
                  className={`w-full py-2 rounded-lg font-semibold ${
                    b.stock <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#590707] hover:bg-[#A30404] text-white"
                  }`}
                >
                  {b.stock <= 0 ? "Sin stock" : "Agregar 🛒"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
