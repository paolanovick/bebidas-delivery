// // src/components/BebidasList.jsx
// import React, { useMemo, useState } from "react";

// const BebidasList = ({ bebidas = [], onEdit, onDelete, showStock = true }) => {
//   const [categoriaActiva, setCategoriaActiva] = useState("Todas");

//   const hayBebidas = bebidas.length > 0;

//   // 🔹 Helper: obtener categorías de una bebida (array)
//   const obtenerCategoriasBebida = (b) => {
//     if (Array.isArray(b.categorias) && b.categorias.length > 0) {
//       return b.categorias;
//     }
//     if (b.categoria) {
//       return [b.categoria];
//     }
//     return ["Sin categoría"];
//   };

//   // 🔹 Todas las categorías únicas (para las pestañas)
//   const categorias = useMemo(() => {
//     if (!hayBebidas) return [];

//     const set = new Set();
//     bebidas.forEach((b) => {
//       obtenerCategoriasBebida(b).forEach((cat) => set.add(cat));
//     });
//     return Array.from(set).sort((a, b) => a.localeCompare(b));
//   }, [bebidas, hayBebidas]);

//   // 🔹 Filtrar por categoría activa
//   const bebidasFiltradas = useMemo(() => {
//     if (!hayBebidas) return [];

//     if (categoriaActiva === "Todas") return bebidas;

//     return bebidas.filter((b) =>
//       obtenerCategoriasBebida(b).includes(categoriaActiva)
//     );
//   }, [bebidas, hayBebidas, categoriaActiva]);

//   // 🔹 Contadores simples
//   const total = bebidas.length;
//   const sinStockCount = bebidas.filter((b) => (b.stock ?? 0) <= 0).length;

//   if (!hayBebidas) {
//     return (
//       <div className="bg-white shadow-xl rounded-xl p-8 text-center border border-[#CDC7BD] mt-6">
//         <p className="text-[#736D66] text-lg mb-4">
//           No hay bebidas registradas todavía
//         </p>
//         <p className="text-[#04090C] font-semibold">
//           ¡Agrega tu primera bebida usando el formulario de arriba!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-6">
//       {/* Encabezado */}
//       <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h3 className="text-2xl font-bold text-[#04090C]">
//             Catálogo de Bebidas
//           </h3>
//           <p className="text-xs text-[#736D66]">
//             Mostrando {bebidasFiltradas.length} de {total} bebidas cargadas.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 text-xs">
//           <div className="bg-white shadow-md border border-[#CDC7BD] rounded-lg px-3 py-2">
//             Total:{" "}
//             <span className="font-bold text-[#590707]">
//               {total}
//             </span>
//           </div>
//           <div className="bg-white shadow-md border border-[#CDC7BD] rounded-lg px-3 py-2">
//             Sin stock:{" "}
//             <span className="font-bold text-[#A30404]">
//               {sinStockCount}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Pestañas de categorías */}
//       {categorias.length > 0 && (
//         <div className="mb-4">
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             <button
//               type="button"
//               onClick={() => setCategoriaActiva("Todas")}
//               className={`px-4 py-2 rounded-full border text-xs whitespace-nowrap transition ${
//                 categoriaActiva === "Todas"
//                   ? "bg-[#590707] text-white border-[#590707]"
//                   : "bg-white text-[#04090C] border-[#CDC7BD] hover:bg-[#F2ECE4]"
//               }`}
//             >
//               Todas
//             </button>
//             {categorias.map((cat) => (
//               <button
//                 key={cat}
//                 type="button"
//                 onClick={() => setCategoriaActiva(cat)}
//                 className={`px-4 py-2 rounded-full border text-xs whitespace-nowrap transition ${
//                   categoriaActiva === cat
//                     ? "bg-[#590707] text-white border-[#590707]"
//                     : "bg-white text-[#04090C] border-[#CDC7BD] hover:bg-[#F2ECE4]"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Si no hay resultados para la categoría seleccionada */}
//       {bebidasFiltradas.length === 0 ? (
//         <div className="bg-white shadow-xl rounded-xl p-6 text-center border border-[#CDC7BD]">
//           <p className="text-[#736D66]">
//             No hay bebidas en la categoría seleccionada.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-[#CDC7BD] rounded-xl shadow-lg text-[#04090C]">
//             <thead className="bg-[#590707] text-white">
//               <tr>
//                 <th className="py-3 px-4 text-left">Imagen</th>
//                 <th className="py-3 px-4 text-left">Nombre</th>
//                 <th className="py-3 px-4 text-left">Categorías</th>
//                 <th className="py-3 px-4 text-left">Tipo</th>
//                 <th className="py-3 px-4 text-left">Precio</th>
//                 <th className="py-3 px-4 text-left">Stock</th>
//                 <th className="py-3 px-4 text-left">Acciones</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bebidasFiltradas.map((b) => {
//                 const categoriasBebida = obtenerCategoriasBebida(b);
//                 const sinStock = (b.stock ?? 0) <= 0;
//                 const stockBajo = !sinStock && (b.stock ?? 0) <= 5;

//                 return (
//                   <tr
//                     key={b._id}
//                     className="border-b hover:bg-[#F2ECE4] transition-colors"
//                   >
//                     <td className="py-3 px-4">
//                       <img
//                         src={b.imagen}
//                         alt={b.nombre}
//                         className="w-14 h-14 object-cover rounded-lg border border-[#CDC7BD]"
//                         onError={(e) => {
//                           e.currentTarget.src =
//                             "https://placehold.co/80x80/CDC7BD/04090C?text=Sin+Img";
//                         }}
//                       />
//                     </td>

//                     <td className="py-3 px-4 font-semibold flex items-center gap-2">
//                       {b.esEstrella && (
//                         <span className="text-xs">⭐</span>
//                       )}
//                       {b.nombre}
//                     </td>

//                     {/* Categorías */}
//                     <td className="py-3 px-4">
//                       <div className="flex flex-wrap gap-1">
//                         {categoriasBebida.map((cat) => (
//                           <span
//                             key={cat}
//                             className="text-[10px] bg-[#F2ECE4] px-2 py-1 rounded-full border border-[#CDC7BD]"
//                           >
//                             {cat}
//                           </span>
//                         ))}
//                       </div>
//                     </td>

//                     {/* Subcategoría (tipo) */}
//                     <td className="py-3 px-4 text-xs">
//                       {b.subcategoria || "-"}
//                     </td>

//                     {/* Precio */}
//                     <td className="py-3 px-4">
//                       ${Number(b.precio || 0).toFixed(2)}
//                     </td>

//                     {/* Stock */}
//                     <td className="py-3 px-4">
//                       {showStock && (
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                             sinStock
//                               ? "bg-red-100 text-red-700"
//                               : stockBajo
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {b.stock ?? 0} {sinStock ? "(sin stock)" : ""}
//                         </span>
//                       )}
//                     </td>

//                     {/* Acciones */}
//                     <td className="py-3 px-4">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => onEdit(b)}
//                           className="px-3 py-1 rounded-lg bg-[#590707] text-white hover:bg-[#A30404] transition text-sm"
//                         >
//                           Editar
//                         </button>
//                         <button
//                           onClick={() => onDelete(b._id)}
//                           className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm"
//                         >
//                           Eliminar
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// // export default BebidasList;
