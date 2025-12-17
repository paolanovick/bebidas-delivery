import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import Sidebar from "./Sidebar";
import CarruselDestacados from "./CarruselDestacados";
import SeccionCategoria from "./SeccionCategoria";
import ProductosGrid from "./ProductosGrid";
import { obtenerConfiguracionHorarios } from "../services/api";
import { getEstadoDelivery } from "../utils/horariosDelivery";
import BannerTicker from "./BannerTicker";

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
  const [mensajeAgregado, setMensajeAgregado] = useState("");
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef(null);

  // ============================
  // CATEGORÍAS Y SUBCATEGORÍAS
  // ============================
  const categorias = [
    "Todas",
    "Combos",
    "Cervezas",
    "Vinos",
    "Espumantes",
    "Aperitivos y Licores",
    "Destilados",
    "Gaseosas y jugos",
    "Energizantes",
    "Snacks",
    "Extras y hielo",
    "Ofertas",
    "Cigarrillos",
  ];

  const subcategoriasMapa = {
    Vinos: ["Todas", "Tinto", "Blanco", "Rosado"],
    Destilados: ["Todas", "Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  };

  const tiposWhisky = ["Todas", "Bourbon", "Scotch", "Irish"];

  // ============================
  // NORMALIZACIÓN DE CATEGORÍAS
  // ============================
  const NORMALIZAR = {
    Gaseosas: "Gaseosas y jugos",
    Jugos: "Gaseosas y jugos",
    Licores: "Aperitivos y Licores",
    Aperitivos: "Aperitivos y Licores",
    Blancas: "Destilados",
    Whisky: "Destilados",
    Energéticas: "Energizantes",
    Esperituosas: "Energizantes",
    Mayoristas: "Ofertas",
    Regalos: "Snacks",
    Snack: "Snacks",
    "Wine Club": "Vinos",
    "Sin categoría": "Extras y hielo",
  };

  const normalizarCategoria = (cat) => NORMALIZAR[cat] || cat;

  // ✅ FUNCIÓN PARA OBTENER CATEGORÍAS NORMALIZADAS
  const obtenerCategoriasNormalizadas = (b) => {
    let cats = [];

    if (Array.isArray(b.categorias)) {
      cats = b.categorias;
    } else if (b.categoria) {
      cats = [b.categoria];
    }

    // Si no tiene categorías o están vacías, asignar "Sin categoría"
    if (cats.length === 0 || cats.every((c) => !c || c.trim() === "")) {
      cats = ["Sin categoría"];
    }

    return cats.map((c) => normalizarCategoria(c.trim()));
  };

  // ============================
  // CARGAR CONFIGURACIONES
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

  // ============================
  // FILTROS Y DATOS
  // ============================
  const bebidasFiltradas = bebidas.filter((b) => {
    const categoriasProducto = obtenerCategoriasNormalizadas(b);

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

  const productosEstrella = bebidas.filter((b) => b.esEstrella);

  const bebidasPorCategoria = bebidas.reduce((acc, b) => {
    const cats = obtenerCategoriasNormalizadas(b);

    cats.forEach((cat) => {
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(b);
    });

    return acc;
  }, {});

  const ordenCategoriasCatalogo = categorias.filter(
    (c) => c !== "Todas" && bebidasPorCategoria[c]
  );

  const sinFiltros =
    categoria === "Todas" &&
    subcategoria === "Todas" &&
    tipo === "Todas" &&
    busqueda.trim() === "";

  // ============================
  // FUNCIONES
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

      {/* OVERLAY MÓVIL */}
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
        <BannerTicker />

        {/* MENSAJE HORARIOS */}
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

        {/* CARRUSEL DESTACADOS */}
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

        {/* TÍTULO CON HAMBURGUESA */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#590707]">
            Catálogo de Bebidas
          </h1>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-2xl text-[#590707]"
          >
            ☰
          </button>
        </div>

        {/* SIN RESULTADOS */}
        {bebidasFiltradas.length === 0 ? (
          <ProductosGrid
            productos={[]}
            fmt={fmt}
            handleAgregar={handleAgregar}
          />
        ) : sinFiltros ? (
          // VISTA NETFLIX
          <div className="space-y-10">
            {ordenCategoriasCatalogo.map((cat) => (
              <SeccionCategoria
                key={cat}
                categoria={cat}
                productos={bebidasPorCategoria[cat]}
                handleAgregar={handleAgregar}
                fmt={fmt}
                setCategoria={setCategoria}
              />
            ))}
          </div>
        ) : (
          // VISTA FILTRADA
          <ProductosGrid
            productos={bebidasFiltradas}
            fmt={fmt}
            handleAgregar={handleAgregar}
          />
        )}
      </main>
    </div>
  );
}
