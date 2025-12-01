// components/BebidasList.jsx
import React, { useMemo, useState } from "react";

const BebidasList = ({ bebidas, onEdit, onDelete }) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroStock, setFiltroStock] = useState("todas"); // todas | conStock | sinStock
  const [orden, setOrden] = useState("nombreAsc"); // nombreAsc | precioAsc | precioDesc | stockAsc | stockDesc

  // ⚠️ Caso sin bebidas cargadas aún
  if (!bebidas || bebidas.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-8 text-center border border-[#CDC7BD] mt-6">
        <p className="text-[#736D66] text-lg mb-4">
          No hay bebidas registradas todavía
        </p>
        <p className="text-[#04090C] font-semibold">
          ¡Agrega tu primera bebida usando el formulario de arriba!
        </p>
      </div>
    );
  }

  // Lista de categorías únicas (para el combo de filtro)
  const categorias = useMemo(
    () =>
      Array.from(new Set(bebidas.map((b) => b.categoria).filter((c) => !!c))),
    [bebidas]
  );

  // 🧠 Procesar: buscar + filtrar + ordenar
  const bebidasFiltradas = useMemo(() => {
    let resultado = [...bebidas];

    // 1) Buscar por nombre
    if (busqueda.trim() !== "") {
      const term = busqueda.toLowerCase();
      resultado = resultado.filter((b) =>
        (b.nombre || "").toLowerCase().includes(term)
      );
    }

    // 2) Filtro de categoría
    if (filtroCategoria !== "todas") {
      resultado = resultado.filter((b) => b.categoria === filtroCategoria);
    }

    // 3) Filtro de stock
    if (filtroStock === "conStock") {
      resultado = resultado.filter((b) => (b.stock ?? 0) > 0);
    } else if (filtroStock === "sinStock") {
      resultado = resultado.filter((b) => (b.stock ?? 0) <= 0);
    }

    // 4) Ordenamiento
    resultado.sort((a, b) => {
      const precioA = Number(a.precio) || 0;
      const precioB = Number(b.precio) || 0;
      const stockA = Number(a.stock) || 0;
      const stockB = Number(b.stock) || 0;

      switch (orden) {
        case "nombreAsc":
          return (a.nombre || "").localeCompare(b.nombre || "");
        case "precioAsc":
          return precioA - precioB;
        case "precioDesc":
          return precioB - precioA;
        case "stockAsc":
          return stockA - stockB;
        case "stockDesc":
          return stockB - stockA;
        default:
          return 0;
      }
    });

    return resultado;
  }, [bebidas, busqueda, filtroCategoria, filtroStock, orden]);

  return (
    <div className="mt-6">
      {/* Encabezado + controles */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-2xl font-bold text-[#04090C]">
          Catálogo de Bebidas ({bebidasFiltradas.length}/{bebidas.length})
        </h3>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-[#CDC7BD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#590707] w-full md:w-56"
          />

          {/* Filtro categoría */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-[#CDC7BD] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#590707] w-full md:w-40"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Filtro stock */}
          <select
            value={filtroStock}
            onChange={(e) => setFiltroStock(e.target.value)}
            className="border border-[#CDC7BD] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#590707] w-full md:w-40"
          >
            <option value="todas">Todo stock</option>
            <option value="conStock">Solo con stock</option>
            <option value="sinStock">Sin stock</option>
          </select>

          {/* Orden */}
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border border-[#CDC7BD] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#590707] w-full md:w-48"
          >
            <option value="nombreAsc">Nombre (A-Z)</option>
            <option value="precioAsc">Precio ↑</option>
            <option value="precioDesc">Precio ↓</option>
            <option value="stockAsc">Stock ↑</option>
            <option value="stockDesc">Stock ↓</option>
          </select>
        </div>
      </div>

      {/* Si con filtros no hay resultados */}
      {bebidasFiltradas.length === 0 ? (
        <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-[#CDC7BD]">
          <p className="text-[#736D66]">
            No se encontraron bebidas con los filtros actuales.
          </p>
          <p className="text-xs text-[#A30404] mt-1">
            Probá limpiar la búsqueda o cambiar los filtros.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-[#CDC7BD] rounded-xl shadow-lg text-[#04090C]">
            <thead className="bg-[#590707] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Imagen</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Precio</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {bebidasFiltradas.map((b) => {
                const sinStock = (b.stock ?? 0) <= 0;
                const stockBajo = !sinStock && (b.stock ?? 0) <= 5;

                return (
                  <tr
                    key={b._id}
                    className="border-b hover:bg-[#F2ECE4] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={b.imagen}
                        alt={b.nombre}
                        className="w-14 h-14 object-cover rounded-lg border border-[#CDC7BD]"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/80x80/CDC7BD/04090C?text=Sin+Img";
                        }}
                      />
                    </td>

                    <td className="py-3 px-4 font-semibold">{b.nombre}</td>
                    <td className="py-3 px-4">{b.categoria || "-"}</td>
                    <td className="py-3 px-4">
                      ${Number(b.precio || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          sinStock
                            ? "bg-red-100 text-red-700"
                            : stockBajo
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {b.stock ?? 0} {sinStock ? "(sin stock)" : ""}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(b)}
                          className="px-3 py-1 rounded-lg bg-[#590707] text-white hover:bg-[#A30404] transition text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(b._id)}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BebidasList;
