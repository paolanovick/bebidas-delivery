import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

// Categorías oficiales fijas del cliente
const CATEGORIAS_OFICIALES = [
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

// Mapeo categorías viejas → nuevas (solo compatibilidad)
const NORMALIZAR = {
  Gaseosas: "Gaseosas y jugos",
  Jugos: "Gaseosas y jugos",
  Licores: "Aperitivos y Licores",
  Aperitivos: "Aperitivos y Licores",
  Blancas: "Destilados",
  Whisky: "Destilados",
  Mayoristas: "Ofertas",
  Regalos: "Snacks",
  "Gift Cards": "Snacks",
  "Wine Club": "Vinos",
  Experiencias: "Vinos",
};

const normalizarCategoria = (cat) => NORMALIZAR[cat] || cat;

export default function BebidasListCategorias({
  bebidas = [],
  onEdit,
  onDelete,
  showStock = true,
}) {
  const navigate = useNavigate();

  const [categoriaActiva, setCategoriaActiva] = useState(
    CATEGORIAS_OFICIALES[0]
  );
  const [orden, setOrden] = useState("recientes");
  const [pagina, setPagina] = useState(1);

  // Reset de página al cambiar filtros
  useEffect(() => {
    setPagina(1);
  }, [categoriaActiva, orden]);

  /* =======================================================
     NORMALIZAR Y OBTENER CATEGORÍAS CORRECTAS
  ======================================================= */
  const obtenerCategoriasBebida = (b) => {
    let cats = [];

    if (Array.isArray(b.categorias)) cats = b.categorias;
    else if (typeof b.categorias === "string") cats = [b.categorias];

    // Normaliza categorías viejas
    return cats
      .map((c) => normalizarCategoria(c))
      .filter((c) => CATEGORIAS_OFICIALES.includes(c));
  };

  /* =======================================================
     FILTRADO POR CATEGORÍA
  ======================================================= */
  const bebidasFiltradas = useMemo(() => {
    let filtradas = bebidas.filter((b) => {
      const cats = obtenerCategoriasBebida(b);
      return cats.includes(categoriaActiva);
    });

    filtradas.sort((a, b) => {
      if (orden === "alfabetico") {
        return (a.nombre || "").localeCompare(b.nombre || "");
      }
      if (orden === "stock") {
        return (Number(b.stock) || 0) - (Number(a.stock) || 0);
      }

      // Orden por recientes (posición original en array)
      return (
        bebidas.findIndex((x) => x._id === b._id) -
        bebidas.findIndex((x) => x._id === a._id)
      );
    });

    return filtradas;
  }, [bebidas, categoriaActiva, orden]);

  /* =======================================================
     PAGINACIÓN
  ======================================================= */
  const totalPaginas = Math.ceil(bebidasFiltradas.length / ITEMS_PER_PAGE);
  const bebidasPagina = bebidasFiltradas.slice(
    (pagina - 1) * ITEMS_PER_PAGE,
    pagina * ITEMS_PER_PAGE
  );

  const sinStockCount = bebidas.filter((b) => (b.stock ?? 0) <= 0).length;

  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <div className="mt-6">
      {/* STATS */}
      <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2 text-xs items-center">
          <div className="bg-[#CDC7BD] text-[#04090C] border border-[#04090C] rounded-lg px-3 py-2">
            Total:
            <span className="font-bold text-[#590707]"> {bebidas.length}</span>
          </div>

          <div className="bg-[#CDC7BD] text-[#04090C] border border-[#04090C] rounded-lg px-3 py-2">
            Sin stock:
            <span className="font-bold text-[#A30404]"> {sinStockCount}</span>
          </div>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="bg-[#CDC7BD] text-[#04090C] border border-[#04090C] rounded-lg px-3 py-2 font-semibold"
          >
            <option value="recientes">Últimos cargados</option>
            <option value="alfabetico">Nombre (A-Z)</option>
            <option value="stock">Stock (mayor a menor)</option>
          </select>
        </div>
      </div>

      {/* BOTONES DE CATEGORÍAS */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIAS_OFICIALES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaActiva === cat
                  ? "bg-[#590707] text-white shadow-lg scale-105"
                  : "bg-[#CDC7BD] text-[#04090C] border border-[#04090C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SI NO HAY BEBIDAS */}
      {bebidasFiltradas.length === 0 ? (
        <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-[#CDC7BD]">
          <p className="text-[#736D66]">
            No hay bebidas en esta categoría todavía.
          </p>
        </div>
      ) : (
        <>
          {/* TABLA */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-[#CDC7BD] rounded-xl shadow-lg text-[#04090C]">
              <thead className="bg-[#590707] text-white">
                <tr>
                  <th className="py-3 px-4">Imagen</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Categorías</th>
                  <th className="py-3 px-4">Subcategoría</th>
                  <th className="py-3 px-4">Tipo Whisky</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {bebidasPagina.map((b) => {
                  const categoriasNorm = obtenerCategoriasBebida(b);
                  const sinStock = (b.stock ?? 0) <= 0;
                  const stockBajo = !sinStock && (b.stock ?? 0) <= 5;

                  return (
                    <tr
                      key={b._id}
                      className="border-b hover:bg-[#F2ECE4] transition"
                    >
                      <td className="py-3 px-4">
                        <img
                          src={b.imagen}
                          alt={b.nombre}
                          className="w-14 h-14 object-contain rounded-lg border border-[#CDC7BD]" /* ✅ Cambiar object-cover por object-contain */
                        />
                      </td>

                      <td className="py-3 px-4 font-semibold">
                        {b.esEstrella && <span>⭐ </span>}
                        {b.nombre}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {categoriasNorm.join(", ") || "-"}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {b.subcategoria || "-"}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {b.tipoWhisky || "-"}
                      </td>

                      <td className="py-3 px-4">
                        ${Number(b.precio).toFixed(2)}
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
                          {b.stock}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onEdit(b);
                              navigate("/admin");
                            }}
                            className="px-3 py-1 bg-[#590707] text-white rounded hover:bg-[#A30404] text-sm"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => onDelete(b._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="flex justify-center gap-2 mt-4 text-xs">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className={`px-3 py-1 rounded-lg border border-[#04090C] ${
                  pagina === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#04090C] hover:bg-[#F2ECE4]"
                }`}
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`px-3 py-1 rounded-lg border border-[#04090C] ${
                    pagina === i + 1
                      ? "bg-[#590707] text-white"
                      : "bg-white text-[#04090C] hover:bg-[#F2ECE4]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className={`px-3 py-1 rounded-lg border border-[#04090C] ${
                  pagina === totalPaginas
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#04090C] hover:bg-[#F2ECE4]"
                }`}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
