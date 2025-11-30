// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

const Navbar = () => {
  // ✅ HOOKS SIEMPRE ARRIBA
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const { carrito, vaciarCarrito } = useCarrito();
  const total = carrito.reduce((sum, el) => sum + (el.cantidad || 0), 0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ OCULTAR NAV EN LA PORTADA NEGRA
  if (location.pathname === "/" || location.pathname === "/inicio") return null;

  return (
    <nav className="bg-[#04090C] text-white fixed top-0 left-0 right-0 z-50 shadow-lg md:static">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <Link to="/tienda">
            <img
              src={`${process.env.PUBLIC_URL}/logoSF.png`}
              alt="Logo Bebidas"
              className="h-32 md:h-40 lg:h-48 w-auto object-contain cursor-pointer"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#CDC7BD] tracking-wide">
            El DANÉS
          </h1>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          {/* Siempre mostrar Tienda */}
          <Link
            to="/tienda"
            className="px-4 py-2 rounded-md bg-[#CDC7BD] text-[#04090C] font-semibold shadow-md hover:bg-[#A30404] hover:text-white transition duration-300"
          >
            Tienda
          </Link>

          {/* Si NO es admin → Mis Pedidos */}
          {usuario && usuario.rol !== "admin" && (
            <Link
              to="/mis-pedidos"
              className="px-4 py-2 rounded-md bg-[#736D66] text-white font-semibold shadow-md hover:bg-[#CDC7BD] hover:text-[#04090C] transition duration-300"
            >
              Mis Pedidos
            </Link>
          )}

          {/* Si es admin → Panel y Pedidos */}
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

          {/* 🛒 Carrito SIEMPRE visible */}
          <Link to="/pedido" id="icono-carrito" className="relative">
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

          {/* Si NO hay usuario → solo Admin Login */}
          {!usuario && (
            <Link
              to="/login-admin"
              className="px-4 py-2 rounded-md bg-[#736D66] text-white font-semibold shadow-md hover:bg-[#CDC7BD] hover:text-[#04090C] transition duration-300"
            >
              Admin Login
            </Link>
          )}

          {/* ✅ Cerrar sesión (DESKTOP) — SOLO CAMBIO ESTO */}
          {usuario && (
            <button
              onClick={() => {
                vaciarCarrito();
                logout();
              }}
              className="px-4 py-2 rounded-md bg-[#590707] text-white font-semibold shadow-md hover:bg-[#A30404] transition duration-300"
            >
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* MENU MOBILE */}
        <div className="md:hidden flex items-center gap-4 relative">
          {/* 🛒 CARRITO (visible siempre en móvil) */}
          <Link to="/pedido" id="icono-carrito" className="relative">
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

          {/* BOTÓN HAMBURGUESA */}
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

          {/* MENÚ DESPLEGABLE */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#04090C] shadow-lg rounded-md flex flex-col gap-2 p-4 z-50">
              <Link
                to="/tienda"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md bg-[#CDC7BD] text-[#04090C] font-semibold"
              >
                Tienda
              </Link>

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

              {!usuario && (
                <Link
                  to="/login-admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-md bg-[#736D66] text-white font-semibold"
                >
                  Admin Login
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
                  Cerrar Sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
