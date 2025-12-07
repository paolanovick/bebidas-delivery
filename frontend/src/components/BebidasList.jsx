// // src/components/BebidasList.jsx
// import React, { useMemo, useState } from "react";

// /* ============================================================
//    FUNCIONES DE NORMALIZACIÓN (iguales al backend)
// ============================================================ */
// const NORMALIZAR = {
//   Gaseosas: "Gaseosas y jugos",
//   Gaseosa: "Gaseosas y jugos",
//   Jugos: "Gaseosas y jugos",

//   Licores: "Aperitivos y Licores",
//   Licor: "Aperitivos y Licores",
//   Aperitivos: "Aperitivos y Licores",
//   Aperitivo: "Aperitivos y Licores",

//   Blancas: "Destilados",
//   Whisky: "Destilados",
//   Whiskys: "Destilados",
//   Whiskeys: "Destilados",
//   Vodka: "Destilados",
//   Gin: "Destilados",
//   Ron: "Destilados",
//   Tequila: "Destilados",

//   Mayoristas: "Ofertas",

//   Regalos: "Snacks",
//   "Gift Cards": "Snacks",

//   "Wine Club": "Vinos",
//   Experiencias: "Vinos",
// };

// const normalizarCategoria = (cat) => NORMALIZAR[cat] || cat;

// /* ============================================================
//    COMPONENTE
// ============================================================ */
// export default function BebidasList({
//   bebidas = [],
//   onEdit,
//   onDelete,
//   showStock = true,
// }) {
//   const [categoriaActiva, setCategoriaActiva] = useState("Todas");

//   /* ------------------------------------------------------------
//      1) Obtener categorías reales y limpias
//   ------------------------------------------------------------ */
//   const obtenerCategorias = (b) => {
//     if (!b.categorias) return ["Sin categoría"];

//     if (Array.isArray(b.categorias)) {
//       return b.categorias.map((c) => normalizarCategoria(c));
//     }

//     return [normalizarCategoria(b.categorias)];
//   };

//   /* ------------------------------------------------------------
//      2) Lista única de categorías (para las pestañas)
//   ------------------------------------------------------------ */
//   const categorias = useMemo(() => {
//     const set = new Set();

//     bebidas.forEach((b) => {
//       obtenerCategorias(b).forEach((c) => set.add(c));
//     });

//     return ["Todas", ...Array.from(set).sort()];
//   }, [bebidas]);

//   /* ------------------------------------------------------------
//      3) Filtrar bebidas por categoría activa
//   ------------------------------------------------------------ */
//   const bebidasFiltradas = useMemo(() => {
//     if (categoriaActiva === "Todas") return bebidas;

//     return bebidas.filter((b) =>
//       obtenerCategorias(b).includes(categoriaActiva)
//     );
//   }, [bebidas, categoriaActiva]);

//   /* ------------------------------------------------------------
//      Contadores
//   ------------------------------------------------------------ */
//   const total = bebidas.length;
//   const sinStockCount = bebidas.filter((b) => (b.stock ?? 0) <= 0).length;

//   if (total === 0) {
//     return (
//       <div className="bg-white shadow-xl rounded-xl p-8 text-center border border-[#CDC7BD] mt-6">
//         <p className="text-[#736D66] text-lg mb-4">
//           No hay bebidas cargadas todavía.
//         </p>
//         <p className="text-[#04090C] font-semibold">
//           Agrega tu primera bebida arriba.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-6">
//       {/* STATS */}
//       <div className="flex justify-between mb-4 text-sm">
//         <div className="flex gap-3">
//           <span className="bg-white border border-[#CDC7BD] px-3 py-2 rounded-lg shadow-md">
//             Total: <b>{total}</b>
//           </span>
//           <span className="bg-white border border-[#CDC7BD] px-3 py-2 rounded-lg shadow-md">
//             Sin stock: <b className="text-red-700">{sinStockCount}</b>
//           </span>
//         </div>
//       </div>

//       {/* PESTAÑAS DE CATEGORÍAS */}
//       <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
//         {categorias.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setCategoriaActiva(cat)}
//             className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
//               categoriaActiva === cat
//                 ? "bg-[#590707] text-white shadow-md"
//                 : "bg-[#CDC7BD] text-[#04090C]"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* TABLA */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-[#CDC7BD] rounded-xl shadow-lg text-[#04090C]">
//           <thead className="bg-[#590707] text-white">
//             <tr>
//               <th className="py-3 px-4 text-left">Imagen</th>
//               <th className="py-3 px-4 text-left">Nombre</th>
//               <th className="py-3 px-4 text-left">Categorías</th>
//               <th className="py-3 px-4 text-left">Subcategoría</th>
//               <th className="py-3 px-4 text-left">Tipo Whisky</th>
//               <th className="py-3 px-4 text-left">Precio</th>
//               <th className="py-3 px-4 text-left">Stock</th>
//               <th className="py-3 px-4 text-left">Acciones</th>
//             </tr>
//           </thead>

//           <tbody>
//             {bebidasFiltradas.map((b) => {
//               const categoriasBebida = obtenerCategorias(b);
//               const sinStock = (b.stock ?? 0) <= 0;
//               const stockBajo = !sinStock && (b.stock ?? 0) <= 5;

//               return (
//                 <tr
//                   key={b._id}
//                   className="border-b hover:bg-[#F2ECE4] transition"
//                 >
//                   <td className="py-3 px-4">
//                     <img
//                       src={b.imagen}
//                       alt={b.nombre}
//                       className="w-14 h-14 object-cover rounded-lg border border-[#CDC7BD]"
//                       onError={(e) => {
//                         e.currentTarget.src =
//                           "https://placehold.co/80x80/CDC7BD/04090C?text=Sin+Img";
//                       }}
//                     />
//                   </td>

//                   <td className="py-3 px-4 font-semibold flex items-center gap-2">
//                     {b.esEstrella && <span className="text-xs">⭐</span>}
//                     {b.nombre}
//                   </td>

//                   <td className="py-3 px-4 text-xs">
//                     <div className="flex flex-wrap gap-1">
//                       {categoriasBebida.map((cat) => (
//                         <span
//                           key={cat}
//                           className="px-2 py-1 text-[10px] bg-[#F2ECE4] border border-[#CDC7BD] rounded-full"
//                         >
//                           {cat}
//                         </span>
//                       ))}
//                     </div>
//                   </td>

//                   <td className="py-3 px-4 text-xs">{b.subcategoria || "-"}</td>

//                   <td className="py-3 px-4 text-xs">{b.tipoWhisky || "-"}</td>

//                   <td className="py-3 px-4">${Number(b.precio).toFixed(2)}</td>

//                   <td className="py-3 px-4">
//                     {showStock && (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           sinStock
//                             ? "bg-red-100 text-red-700"
//                             : stockBajo
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {b.stock} {sinStock ? "(sin stock)" : ""}
//                       </span>
//                     )}
//                   </td>

//                   <td className="py-3 px-4">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => onEdit(b)}
//                         className="px-3 py-1 rounded-lg bg-[#590707] text-white text-sm hover:bg-[#A30404]"
//                       >
//                         Editar
//                       </button>
//                       <button
//                         onClick={() => onDelete(b._id)}
//                         className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
//                       >
//                         Eliminar
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
