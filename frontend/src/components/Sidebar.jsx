import React, { useState } from "react";

export default function Sidebar({
  categoria,
  setCategoria,
  subcategoria,
  setSubcategoria,
  tipo,
  setTipo,
  busqueda,
  setBusqueda,
  categorias,
  subcategoriasMapa,
  tiposWhisky,
  menuAbierto,
  setMenuAbierto,
}) {
  const [expandido, setExpandido] = useState({});

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#CDC7BD]
        p-6 z-40 shadow transform transition-transform duration-300
        pt-16 md:pt-6 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
    >
      {/* BUSCADOR */}
      <label className="text-sm text-[#736D66] block mb-2 font-semibold">
        Buscar
      </label>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] mb-6 bg-white text-[#04090C] placeholder-gray-400 font-medium"
        placeholder="Ej: Malbec, Gin..."
      />

      {/* CATEGORÍAS */}
      <label className="text-sm text-[#736D66] block mb-2 font-semibold">
        Categorías
      </label>
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setCategoria(cat);
            setSubcategoria("Todas");
            setTipo("Todas");
          }}
          className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition text-[#04090C] ${
            categoria === cat
              ? "bg-[#590707] text-white shadow"
              : "hover:bg-[#CDC7BD]"
          }`}
        >
          {cat}
        </button>
      ))}

      {/* SUBCATEGORÍAS CON ACORDEÓN */}
      {subcategoriasMapa[categoria] && (
        <div className="mt-4">
          <button
            onClick={() =>
              setExpandido((prev) => ({
                ...prev,
                [categoria]: !prev[categoria],
              }))
            }
            className="w-full flex items-center justify-between px-4 py-2 bg-[#F2ECE4] rounded-lg text-[#590707] font-semibold hover:bg-[#E8DCCF] transition"
          >
            Subcategoría
            <span
              className={`transition-transform ${
                expandido[categoria] ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {expandido[categoria] && (
            <div className="mt-2 space-y-1 bg-[#F2ECE4] p-2 rounded-lg">
              {subcategoriasMapa[categoria]
                .filter((s) => s !== "Todas")
                .map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSubcategoria(sub);
                      setTipo("Todas");
                    }}
                    className={`w-full text-left px-3 py-1 rounded text-sm transition ${
                      subcategoria === sub
                        ? "bg-[#590707] text-white"
                        : "text-[#04090C] hover:bg-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TIPOS WHISKY */}
      {categoria === "Destilados" && subcategoria === "Whisky" && (
        <>
          <label className="text-sm text-[#736D66] block mt-4 mb-2">
            Tipo Whisky
          </label>

          {tiposWhisky.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition text-[#04090C] ${
                tipo === t
                  ? "bg-[#590707] text-white shadow"
                  : "hover:bg-[#CDC7BD]"
              }`}
            >
              {t}
            </button>
          ))}
        </>
      )}
    </aside>
  );
}
