import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Facebook, Instagram, Share2, Store } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";
import {
  esRutaEcommerce,
  esRutaIngreso,
  habilitarIngresoTienda,
  tieneIngresoTienda,
} from "../utils/ingresoTienda";

const Navbar = () => {
  
  const { usuario, logout } = useAuth();
  const { carrito, vaciarCarrito } = useCarrito();
  const total = carrito.reduce((sum, el) => sum + (el.cantidad || 0), 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compacto, setCompacto] = useState(false);
  const location = useLocation();
  const ingresoHabilitado = tieneIngresoTienda();
  const enIngreso = esRutaIngreso(location.pathname);
  const mostrarNavegacionTienda = ingresoHabilitado && !enIngreso;
  const mostrarCarrito =
    mostrarNavegacionTienda && esRutaEcommerce(location.pathname);
  // En admin, achicar esta barra sticky cambia la altura del documento y puede
  // alternar el scroll entre ambos estados cerca del inicio.
  const mostrarBarraCompacta = compacto && !menuOpen && !location.pathname.startsWith("/admin");

  useEffect(() => {
    const actualizarBarra = () => setCompacto(window.scrollY > 24);
    actualizarBarra();
    window.addEventListener("scroll", actualizarBarra, { passive: true });
    return () => window.removeEventListener("scroll", actualizarBarra);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-compact", mostrarBarraCompacta);
    return () => document.body.classList.remove("nav-compact");
  }, [mostrarBarraCompacta]);

  const handleShare = () => {
    const url = window.location.origin;
    if (navigator.share) {
      navigator.share({
        title: "EL DANES Bebidas & Delivery",
        text: "Te comparto la web de EL DANES Bebidas & Delivery",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado");
    }
  };

  return (
    <>
    {/* Conserva la altura original al compactar la barra, sin mover el contenido. */}
    <div className="hidden md:block md:h-48 lg:h-56" aria-hidden="true" />
    <nav className="bg-[#04090C] text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      {mostrarBarraCompacta ? (
        <div className="h-14 md:h-16 w-full flex items-center justify-between px-2 sm:px-4 md:px-6">
          <Link
            to={mostrarNavegacionTienda ? "/tienda?reset=true" : "/"}
            onClick={mostrarNavegacionTienda ? habilitarIngresoTienda : undefined}
            aria-label="El Danés, inicio de la tienda"
            className="shrink-0"
          >
            <img src={`${process.env.PUBLIC_URL}/logoSF.png`} alt="El Danés" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-2 md:gap-3">
            <a href="https://www.facebook.com/ivanito10?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-9 w-9 md:h-10 md:w-10 grid place-items-center text-[#CDC7BD] hover:text-white"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/bebidaseldanes/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-9 w-9 md:h-10 md:w-10 grid place-items-center text-[#CDC7BD] hover:text-white"><Instagram size={20} /></a>
            <button type="button" onClick={handleShare} aria-label="Compartir" className="h-9 w-9 md:h-10 md:w-10 grid place-items-center text-[#CDC7BD] hover:text-white"><Share2 size={20} /></button>
            <Link to="/tienda" onClick={habilitarIngresoTienda} aria-label="Tienda" className="h-9 w-9 md:h-10 md:w-10 grid place-items-center text-[#CDC7BD] hover:text-white"><Store size={20} /></Link>
            {mostrarCarrito && (
              <Link to="/pedido" aria-label={`Carrito, ${total} productos`} data-cart-target className="relative h-9 w-9 md:h-10 md:w-10 grid place-items-center text-[#CDC7BD] hover:text-white">
                <ShoppingCart size={22} />
                {total > 0 && <span className="absolute -top-1 -right-1 bg-[#A30404] text-white text-xs rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center">{total}</span>}
              </Link>
            )}
          </div>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* ✅ LOGO Y TÍTULO - Van a /tienda reseteando filtros SIN perder carrito */}
        <div className="flex items-center gap-4">
          {mostrarNavegacionTienda ? (
            <Link
              to="/tienda?reset=true"
              onClick={habilitarIngresoTienda}
              className="block cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={`${process.env.PUBLIC_URL}/logoSF.png`}
                alt="Logo El Danés"
                className="h-32 md:h-40 lg:h-48 w-auto object-contain"
              />
            </Link>
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/logoSF.png`}
              alt="Logo El Danés"
              className="h-32 md:h-40 lg:h-48 w-auto object-contain"
            />
          )}

          {mostrarNavegacionTienda ? (
            <Link
              to="/tienda?reset=true"
              onClick={habilitarIngresoTienda}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#CDC7BD] tracking-wide">
                EL DANES
              </h1>
            </Link>
          ) : (
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#CDC7BD] tracking-wide">
              EL DANES
            </h1>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/ivanito10?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CDC7BD] hover:text-[#A30404] transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/bebidaseldanes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#CDC7BD] hover:text-[#A30404] transition"
            >
              <Instagram size={20} />
            </a>
            <button
              type="button"
              onClick={handleShare}
              className="text-[#CDC7BD] hover:text-[#A30404] transition"
            >
              <Share2 size={20} />
            </button>
          </div>

          {mostrarNavegacionTienda && (
            <Link
              to="/tienda"
              onClick={habilitarIngresoTienda}
              className="px-4 py-2 rounded-md bg-[#CDC7BD] text-[#04090C] font-semibold shadow-md hover:bg-[#A30404] hover:text-white transition duration-300"
            >
              Tienda
            </Link>
          )}

          {usuario && usuario.rol !== "admin" && (
            <Link
              to="/mis-pedidos"
              className="px-4 py-2 rounded-md bg-[#736D66] text-white font-semibold shadow-md hover:bg-[#CDC7BD] hover:text-[#04090C] transition duration-300"
            >
              Mis Pedidos
            </Link>
          )}

          {usuario?.rol === "admin" && (
            <>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-md bg-[#590707] text-white font-semibold shadow-md hover:bg-[#A30404] transition duration-300"
              >
                Panel Bebidas
              </Link>
              <Link
                to="/admin-pedidos"
                className="px-4 py-2 rounded-md bg-[#736D66] text-white font-semibold shadow-md hover:bg-[#CDC7BD] hover:text-[#04090C] transition duration-300"
              >
                Pedidos
              </Link>
            </>
          )}

          {mostrarCarrito && (
            <Link
              to="/pedido"
              className="relative inline-flex items-center justify-center"
              data-cart-target
            >
              <ShoppingCart
                size={28}
                className="text-[#CDC7BD] hover:text-white transition"
              />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#A30404] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {total}
                </span>
              )}
            </Link>
          )}

          {usuario && (
            <button
              onClick={() => {
                vaciarCarrito();
                logout();
              }}
              className="px-4 py-2 rounded-md bg-[#590707] text-white font-semibold shadow-md hover:bg-[#A30404] transition duration-300"
            >
              Cerrar Sesion
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4 relative">
          {mostrarCarrito && (
            <Link
              to="/pedido"
              className="relative inline-flex items-center justify-center"
              data-cart-target
            >
              <ShoppingCart
                size={28}
                className="text-[#CDC7BD] hover:text-white transition"
              />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#A30404] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {total}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-[#CDC7BD]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#CDC7BD"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#04090C] shadow-lg rounded-md flex flex-col gap-2 p-4 z-50">
              {mostrarNavegacionTienda && (
                <Link
                  to="/tienda"
                  onClick={() => {
                    habilitarIngresoTienda();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-md bg-[#CDC7BD] text-[#04090C] font-semibold"
                >
                  Tienda
                </Link>
              )}

              <div className="flex gap-3 px-3 py-2">
                <a
                  href="https://www.facebook.com/ivanito10?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CDC7BD] hover:text-[#A30404] transition"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/bebidaseldanes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CDC7BD] hover:text-[#A30404] transition"
                >
                  <Instagram size={20} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleShare();
                    setMenuOpen(false);
                  }}
                  className="text-[#CDC7BD] hover:text-[#A30404] transition"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {usuario && usuario.rol !== "admin" && (
                <Link
                  to="/mis-pedidos"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md bg-[#736D66] text-white font-semibold"
                >
                  Mis Pedidos
                </Link>
              )}

              {usuario?.rol === "admin" && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-md bg-[#590707] text-white font-semibold"
                  >
                    Panel Bebidas
                  </Link>
                  <Link
                    to="/admin-pedidos"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-md bg-[#736D66] text-white font-semibold"
                  >
                    Pedidos
                  </Link>
                </>
              )}

              {usuario && (
                <button
                  onClick={() => {
                    vaciarCarrito();
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-md bg-[#590707] text-white font-semibold shadow-md hover:bg-[#A30404] transition duration-300"
                >
                  Cerrar Sesion
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
