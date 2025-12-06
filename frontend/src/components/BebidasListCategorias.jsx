import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

// 🔥 CATEGORÍAS OFICIALES DEL CLIENTE (FIJAS)
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

// 🔥 MAPEO de categorías viejas → nuevas (para evitar que desaparezcan productos)
const NORMALIZAR = {
  Gaseosas: "Gaseosas y jugos",
  Jugos: "Gaseosas y jugos",

  Licores: "Aperitivos y Licores",
  Aperitivos: "Aperitivos y Licores",

  Blancas: "Destilados",
  Whisky: "Destilados",

  Mayoristas: "Ofertas",
  Ofertas: "Ofertas",

  Regalos: "Snacks",
  "Gift Cards": "Snacks",

  "Wine Club": "Vinos",
  Experiencias: "Vinos",
};

// Normaliza una categoría vieja a la nueva oficial
const normalizarCategoria = (cat) => {
  if (!cat) return "Sin categoría";
  return NORMALIZAR[cat] || cat;
};

const BebidasListCategorias = ({
  bebidas = [],
  onEdit,
  onDelete,
  showStock = true,
}) => {
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [pagina, setPagina] = useState(1);

  const navigate = useNavigate();
  

  // 🔥 Obtiene categorías normales siempre como array
  const obtenerCategoriasBebida = (b) => {
    let cats = [];

    if (Array.isArray(b.categorias) && b.categorias.length > 0)
      cats = b.categorias;
    else if (typeof b.categorias === "string") cats = [b.categorias];
    else if (Array.isArray(b.categoria)) cats = b.categoria;
    else if (typeof b.categoria === "string") cats = [b.categoria];

    // Normalizar todas
    const normalizadas = cats.map((c) => normalizarCategoria(c));

    // Filtrar solo categorías oficiales
    return normalizadas.filter((n) => CATEGORIAS_OFICIALES.includes(n));
  };

  // ✔ Las 10 categorías oficiales SIEMPRE visibles
  const categorias = CATEGORIAS_OFICIALES;

 useEffect(() => {
   if (!categoriaActiva) {
     setCategoriaActiva(categorias[0]);
   }
 }, [categoriaActiva, categorias]);


  useEffect(() => {
    setPagina(1);
  }, [categoriaActiva, orden]);

  // Filtrado según categoría activa
  const bebidasFiltradas = useMemo(() => {
    if (!categoriaActiva) return [];

    let resultado = bebidas.filter((b) => {
      const cats = obtenerCategoriasBebida(b);
      return cats.includes(categoriaActiva);
    });

    resultado.sort((a, b) => {
      const stockA = Number(a.stock) || 0;
      const stockB = Number(b.stock) || 0;

      switch (orden) {
        case "alfabetico":
          return (a.nombre || "").localeCompare(b.nombre || "");
        case "stock":
          return stockB - stockA;
        case "recientes":
        default:
          const idxA = bebidas.findIndex((x) => x._id === a._id);
          const idxB = bebidas.findIndex((x) => x._id === b._id);
          return idxB - idxA;
      }
    });

    return resultado;
  }, [bebidas, categoriaActiva, orden]);

  const totalPaginas = Math.ceil(bebidasFiltradas.length / ITEMS_PER_PAGE);
  const inicio = (pagina - 1) * ITEMS_PER_PAGE;
  const bebidasPagina = bebidasFiltradas.slice(inicio, inicio + ITEMS_PER_PAGE);

  const total = bebidas.length;
  const sinStockCount = bebidas.filter((b) => (b.stock ?? 0) <= 0).length;

  return (
    <div className="mt-6">
      {/* STATS */}
      <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2 text-xs items-center">
          <div className="bg-white text-[#04090C] shadow-md border border-[#CDC7BD] rounded-lg px-3 py-2">
            Total: <span className="font-bold text-[#590707]">{total}</span>
          </div>

          <div className="bg-white text-[#04090C] shadow-md border border-[#CDC7BD] rounded-lg px-3 py-2">
            Sin stock:{" "}
            <span className="font-bold text-[#A30404]">{sinStockCount}</span>
          </div>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border border-[#CDC7BD] rounded-lg px-2 py-1 bg-white text-[#04090C]"
          >
            <option value="recientes">Últimos cargados</option>
            <option value="alfabetico">Nombre (A-Z)</option>
            <option value="stock">Stock (mayor a menor)</option>
          </select>
        </div>
      </div>

      {/* 🔥 CATEGORÍAS OFICIALES SIEMPRE VISIBLES */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((cat) => {
            const activa = categoriaActiva === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activa
                    ? "bg-[#590707] text-white shadow-lg scale-105"
                    : "bg-[#CDC7BD] text-[#04090C] border border-[#a89f95]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Si no hay bebidas */}
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
                  <th className="py-3 px-4 text-left">Imagen</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Categorías</th>
                  <th className="py-3 px-4 text-left">Subcategoría</th>
                  <th className="py-3 px-4 text-left">Precio</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {bebidasPagina.map((b) => {
                  const categoriasBebida = obtenerCategoriasBebida(b);
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
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/80x80/CDC7BD/04090C?text=Sin+Img")
                          }
                        />
                      </td>

                      <td className="py-3 px-4 font-semibold flex items-center gap-2">
                        {b.esEstrella && <span className="text-xs">⭐</span>}
                        {b.nombre}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {categoriasBebida.map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] bg-[#F2ECE4] px-2 py-1 rounded-full border border-[#CDC7BD]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {b.subcategoria || "-"}
                      </td>

                      <td className="py-3 px-4">
                        ${Number(b.precio || 0).toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        {showStock && (
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
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onEdit(b);
                              navigate("/admin");
                            }}
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

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1 rounded-lg border bg-white hover:bg-[#F2ECE4]"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    pagina === i + 1
                      ? "bg-[#590707] text-white"
                      : "bg-white hover:bg-[#F2ECE4]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="px-3 py-1 rounded-lg border bg-white hover:bg-[#F2ECE4]"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BebidasListCategorias;
