import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import Sidebar from "./Sidebar";
import CarruselDestacados from "./CarruselDestacados";
import SeccionCategoria from "./SeccionCategoria";
import ProductosGrid from "./ProductosGrid";
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
  // CATEGORÍAS Y SUBCATEGORÍAS
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

  const subcategoriasMapa = {
    Vinos: ["Todas", "Tinto", "Blanco", "Rosado"],
    Destilados: ["Todas", "Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  };

  const tiposWhisky = ["Todas", "Bourbon", "Scotch", "Irish"];

  // ============================
  // CARGAR CONFIGURACIONES
  // ============================
  useEffect(() => {
    getEnvioConfig().then(setEnvioConfig);
  }, []);

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
   const categoriasProducto = Array.isArray(b.categorias)
     ? b.categorias.map((c) => c.trim())
     : b.categoria
     ? [b.categoria.trim()]
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

  const productosEstrella = bebidas.filter((b) => b.esEstrella);

const bebidasPorCategoria = bebidas.reduce((acc, b) => {
  const cats = Array.isArray(b.categorias)
    ? b.categorias.map((c) => c.trim())
    : b.categoria
    ? [b.categoria.trim()]
    : [];

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

        {/* MENSAJE ENVÍO */}
        {envioConfig?.activo && envioConfig?.mensaje && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#A30404] text-white shadow-md flex items-center gap-3">
            📦 <p>{envioConfig.mensaje}</p>
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

        {/* TÍTULO */}
        {/* TÍTULO CON HAMBURGUESA */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-2xl text-[#590707]"
          >
            ☰
          </button>
          {/* TÍTULO CON HAMBURGUESA */}
          {/* <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden text-2xl text-[#590707]"
            >
              ☰
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-[#590707]">
              Catálogo de Bebidas
            </h1>
          </div> */}
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
