/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  const [mensaje, setMensaje] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const categorias = [
    "Todas",
    "Vinos",
    "Cervezas",
    "Espumantes",
    "Whisky",
    "Blancas",
    "Licores",
    "Aperitivos",
    "Espirituosas",
    "Mayoristas",
    "Ofertas",
    "Regalos",
    "Gift Cards",
    "Wine Club",
    "Experiencias",
  ];

  // ✅ FILTRO
  const bebidasFiltradas = bebidas.filter((b) => {
    const matchCat = categoria === "Todas" || b.categoria === categoria;
    const q = busqueda.toLowerCase();
    const matchTxt =
      (b.nombre || "").toLowerCase().includes(q) ||
      (b.descripcion || "").toLowerCase().includes(q);
    return matchCat && matchTxt;
  });

  // ✅ Agregar al carrito con aviso si no estás logueada
  const handleAgregar = (b) => {
   // const token = localStorage.getItem("token");
   // if (!token) {
    //  alert("⚠ Debes iniciar sesión para agregar productos al carrito.");
   //   return;
   // }
    agregar(b);
  };

  const fmt = (n) =>
    new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

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
        ${
          menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-[#CDC7BD]" />

        <button
          onClick={() => setMenuAbierto(false)}
          className="md:hidden ml-auto mb-4 text-[#590707] font-bold"
        >
          ✖
        </button>

        {/* Buscador */}
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#736D66] uppercase mb-1">
              Tienda
            </p>
            <h2 className="text-2xl font-semibold text-[#04090C]">Filtros</h2>
          </div>

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
        </div>
      </aside>

      {/* CATÁLOGO */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-5xl font-bold text-center text-[#590707] mb-8">
          Catálogo de Bebidas
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {bebidasFiltradas.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-[#CDC7BD] p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <img
                  src={b.imagen}
                  alt={b.nombre || "Imagen de bebida"}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen";
                  }}
                />

                <h3 className="text-2xl font-semibold text-[#04090C] mb-1">
                  {b.nombre}
                </h3>

                <p className="text-[#736D66] text-sm mb-3 line-clamp-2">
                  {b.descripcion}
                </p>

                <p className="text-[#590707] font-bold text-3xl mb-4">
                  ${fmt(b.precio)}
                </p>
              </div>

              <button
                onClick={() => handleAgregar(b)}
                className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-2 rounded-xl font-semibold transition mt-auto"
              >
                Agregar al carrito 🛒
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
