import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

// 🔥 CATEGORÍAS OFICIALES DEL CLIENTE
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
  const hayBebidas = bebidas.length > 0;

  // Normaliza categorías de una bebida
  const obtenerCategoriasBebida = (b) => {
    if (Array.isArray(b.categorias) && b.categorias.length > 0) {
      return b.categorias;
    }
    if (typeof b.categorias === "string") return [b.categorias];
    if (Array.isArray(b.categoria) && b.categoria.length > 0)
      return b.categoria;
    if (typeof b.categoria === "string") return [b.categoria];
    return ["Sin categoría"];
  };

  // Categorías presentes en DB que coinciden con las oficiales
  const categorias = useMemo(() => {
    if (!hayBebidas) return [];

    const encontradas = new Set();

    bebidas.forEach((b) =>
      obtenerCategoriasBebida(b).forEach((cat) => {
        if (CATEGORIAS_OFICIALES.includes(cat)) encontradas.add(cat);
      })
    );

    // Mantener el orden oficial
    return CATEGORIAS_OFICIALES.filter((c) => encontradas.has(c));
  }, [bebidas, hayBebidas]);

  useEffect(() => {
    if (categorias.length > 0 && !categorias.includes(categoriaActiva)) {
      setCategoriaActiva(categorias[0]);
    }
  }, [categorias, categoriaActiva]);

  useEffect(() => {
    setPagina(1);
  }, [categoriaActiva, orden]);

  // Filtrado según categoría activa
  const bebidasFiltradas = useMemo(() => {
    if (!hayBebidas || !categoriaActiva) return [];

    let resultado = bebidas.filter((b) =>
      obtenerCategoriasBebida(b).includes(categoriaActiva)
    );

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
  }, [bebidas, hayBebidas, categoriaActiva, orden]);

  const totalPaginas = Math.ceil(bebidasFiltradas.length / ITEMS_PER_PAGE);
  const inicio = (pagina - 1) * ITEMS_PER_PAGE;
  const bebidasPagina = bebidasFiltradas.slice(inicio, inicio + ITEMS_PER_PAGE);

  const total = bebidas.length;
  const sinStockCount = bebidas.filter((b) => (b.stock ?? 0) <= 0).length;

  if (!hayBebidas) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-8 text-center border border-[#CDC7BD] mt-6">
        <p className="text-[#736D66] text-lg mb-4">
          No hay bebidas registradas.
        </p>
        <p className="text-[#04090C] font-semibold">
          ¡Agregá tu primera bebida usando el formulario!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Encabezado */}
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
            className="border border-[#CDC7BD] rounded-lg px-2 py-1 bg-white text-[#04090C] focus:outline-none focus:ring-2 focus:ring-[#590707]"
          >
            <option value="recientes">Últimos cargados</option>
            <option value="alfabetico">Nombre (A-Z)</option>
            <option value="stock">Stock (mayor a menor)</option>
          </select>
        </div>
      </div>

      {/* Categorías */}
      {categorias.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categorias.map((cat) => {
              const activa = categoriaActiva === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activa
                      ? "bg-[#590707] text-white shadow-lg scale-105"
                      : "bg-[#CDC7BD] text-[#04090C] border border-[#a89f95] hover:bg-[#bfb7ad]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Si no hay bebidas en categoría */}
      {bebidasFiltradas.length === 0 ? (
        <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-[#CDC7BD]">
          <p className="text-[#736D66]">No hay bebidas en esta categoría.</p>
        </div>
      ) : (
        <>
          {/* Tabla */}
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
                            (e.currentTarget.src =
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

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className={`px-3 py-1 rounded-lg border ${
                  pagina === 1
                    ? "text-[#736D66] border-[#CDC7BD] bg-[#F7F5F2]"
                    : "text-[#04090C] border-[#CDC7BD] bg-white hover:bg-[#F2ECE4]"
                }`}
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    pagina === i + 1
                      ? "bg-[#590707] text-white border-[#590707]"
                      : "bg-white text-[#04090C] border-[#CDC7BD] hover:bg-[#F2ECE4]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className={`px-3 py-1 rounded-lg border ${
                  pagina === totalPaginas
                    ? "text-[#736D66] border-[#CDC7BD] bg-[#F7F5F2]"
                    : "text-[#04090C] border-[#CDC7BD] bg-white hover:bg-[#F2ECE4]"
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
};

export default BebidasListCategorias;
