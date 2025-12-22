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

  // ✅ FUNCIÓN PARA CERRAR MENÚ AL SELECCIONAR
  const seleccionarYCerrar = (callback) => {
    callback();
    setMenuAbierto(false);
  };

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
        onChange={(e) => {
          setBusqueda(e.target.value);
          // Cierra el menú automáticamente después de buscar
          if (e.target.value.length > 2) {
            setTimeout(() => setMenuAbierto(false), 800);
          }
        }}
        className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] mb-6 bg-white text-[#04090C] placeholder-gray-400 font-medium"
        placeholder="Ej: Malbec, Gin..."
      />

      {/* CATEGORÍAS */}
      <label className="text-sm text-[#736D66] block mb-2 font-semibold">
        Categorías
      </label>
      {categorias.map((cat) => (
        <div key={cat}>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() =>
                seleccionarYCerrar(() => {
                  setCategoria(cat);
                  setSubcategoria("Todas");
                  setTipo("Todas");
                })
              }
              className={`flex-1 text-left px-4 py-2 rounded-lg mb-2 transition text-[#04090C] ${
                categoria === cat
                  ? "bg-[#590707] text-white shadow"
                  : "hover:bg-[#CDC7BD]"
              }`}
            >
              {cat}
            </button>

            {subcategoriasMapa[cat] && (
              <button
                onClick={() =>
                  setExpandido((prev) => ({
                    ...prev,
                    [cat]: !prev[cat],
                  }))
                }
                className={`px-3 py-2 rounded-lg transition ${
                  categoria === cat
                    ? "text-white"
                    : "text-[#590707] hover:bg-[#CDC7BD]"
                }`}
              >
                <span
                  className={`transition-transform inline-block ${
                    expandido[cat] ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            )}
          </div>

          {subcategoriasMapa[cat] && expandido[cat] && (
            <div className="ml-4 mb-2 space-y-1 bg-[#F2ECE4] p-2 rounded-lg">
              {subcategoriasMapa[cat]
                .filter((s) => s !== "Todas")
                .map((sub) => (
                  <button
                    key={sub}
                    onClick={() =>
                      seleccionarYCerrar(() => {
                        setCategoria(cat);
                        setSubcategoria(sub);
                        setTipo("Todas");
                      })
                    }
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

          {cat === "Destilados" &&
            subcategoria === "Whisky" &&
            expandido[cat] && (
              <div className="ml-8 mb-2 space-y-1 bg-[#E8DCCF] p-2 rounded-lg">
                <p className="text-xs text-[#736D66] font-semibold mb-1">
                  Tipo Whisky
                </p>
                {tiposWhisky
                  .filter((t) => t !== "Todas")
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() =>
                        seleccionarYCerrar(() => setTipo(t))
                      }
                      className={`w-full text-left px-3 py-1 rounded text-sm transition ${
                        tipo === t
                          ? "bg-[#590707] text-white"
                          : "text-[#04090C] hover:bg-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
              </div>
            )}
        </div>
      ))}
    </aside>
  );
}