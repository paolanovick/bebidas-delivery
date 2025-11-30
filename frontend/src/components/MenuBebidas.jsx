import React, { useState, useRef, useEffect } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MenuBebidas() {
  const { bebidas } = useBebidas();
  const { agregar } = useCarrito();

  const [categoria, setCategoria] = useState("Todas");
  const [subcategoria, setSubcategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // PAUSA DEL SCROLL
  const [paused, setPaused] = useState(false);
   const [mensajeAgregado, setMensajeAgregado] = useState("");

  // REFERENCIA DEL CARRUSEL
  const carouselRef = useRef(null);

  // AUTO-SCROLL + LOOP INFINITO
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const interval = setInterval(() => {
      if (!paused) {
        carousel.scrollLeft += 1;

        // loop infinito real
        if (
          carousel.scrollLeft >=
          carousel.scrollWidth - carousel.clientWidth
        ) {
          carousel.scrollLeft = 0;
        }
      }
    }, 15);

    return () => clearInterval(interval);
  }, [paused]);

  const categorias = [
    "Todas",
    "Vinos",
    "Cervezas",
    "Gaseosas",
    "Jugos",
    "Espumantes",
    "Whisky",
    "Blancas",
    "Licores",
    "Aperitivos",
    "Energéticas",
    "Aguas",
    "Combos",
    "Mayoristas",
    "Ofertas",
    "Regalos",
    "Gift Cards",
    "Wine Club",
    "Experiencias",
  ];

  const subcategoriasVinos = ["Todas", "Tinto", "Blanco", "Rosé"];

  const bebidasFiltradas = bebidas.filter((b) => {
    let categoriasProducto = [];

    if (Array.isArray(b.categorias) && b.categorias.length > 0) {
      categoriasProducto = b.categorias;
    } else if (b.categoria) {
      categoriasProducto = [b.categoria];
    }

    const matchCat =
      categoria === "Todas" ||
      categoriasProducto.some(
        (cat) => cat.toLowerCase() === categoria.toLowerCase()
      );

    const matchSubcat =
      subcategoria === "Todas" ||
      !b.subcategoria ||
      b.subcategoria === subcategoria;

    const q = busqueda.toLowerCase();
    const matchTxt =
      !q ||
      (b.nombre || "").toLowerCase().includes(q) ||
      (b.descripcion || "").toLowerCase().includes(q);

    return matchCat && matchSubcat && matchTxt;
  });

 const productosEstrella = bebidas.filter((b) => b.esEstrella);

 const handleAgregar = (b) => {
   agregar(b);

   setMensajeAgregado(`${b.nombre} agregado al carrito 🛒`);

   setTimeout(() => {
     setMensajeAgregado("");
   }, 3000);
 };

 const fmt = (n) =>
   new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);

 const mostrarSubcategorias = categoria === "Vinos";

 const scrollCarousel = (direction) => {
   if (carouselRef.current) {
     const scrollAmount = 300;
     carouselRef.current.scrollBy({
       left: direction === "left" ? -scrollAmount : scrollAmount,
       behavior: "smooth",
     });
   }
 };

 return (
   <div className="flex min-h-screen bg-[#F7F5F2]">
     {/* ✅ TOAST: mensaje producto agregado */}
     {mensajeAgregado && (
       <div
         className="
            fixed bottom-6 left-1/2 -translate-x-1/2 z-50
            bg-green-600 text-white px-4 py-2 rounded-full shadow-lg
            text-sm sm:text-base
          "
       >
         {mensajeAgregado}
       </div>
     )}
     {/* botón hamburguesa */}
     <button
       onClick={() => setMenuAbierto(true)}
       className="md:hidden fixed top-20 left-4 z-40 bg-[#590707] text-white px-3 py-2 rounded-lg shadow-lg"
     >
       ☰
     </button>

     {/* overlay móviles */}
     {menuAbierto && (
       <div
         className="fixed inset-0 bg-black/40 z-30 md:hidden"
         onClick={() => setMenuAbierto(false)}
       />
     )}

     {/* SIDEBAR */}
     <aside
       className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#CDC7BD] 
    p-6 z-40 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transform transition-transform duration-300
    pt-16 md:pt-6
    ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    overflow-y-auto max-h-screen`}
     >
       <div className="absolute top-0 left-0 h-1 w-full bg-[#CDC7BD]" />

       <button
         onClick={() => setMenuAbierto(false)}
         className="md:hidden ml-auto mb-4 text-[#590707] font-bold"
       >
         ✖
       </button>

       <div className="space-y-6">
         {/* buscador */}
         <div>
           <label className="text-sm text-[#736D66] block mb-2">Buscar</label>
           <input
             value={busqueda}
             onChange={(e) => setBusqueda(e.target.value)}
             className="w-full px-4 py-2 rounded-lg border border-[#CDC7BD] bg-white text-[#04090C] placeholder-[#736D66]/80"
             placeholder="Ej: Malbec, Whisky..."
           />
         </div>

         {/* categorías */}
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
                   setSubcategoria("Todas");
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

         {/* subcategorías vinos */}
         {mostrarSubcategorias && (
           <div>
             <label className="text-sm text-[#736D66] block mb-2">
               Tipo de Vino
             </label>
             <div className="space-y-2">
               {subcategoriasVinos.map((sub) => (
                 <button
                   key={sub}
                   onClick={() => setSubcategoria(sub)}
                   className={`w-full text-left px-4 py-2 rounded-lg border transition text-sm ${
                     subcategoria === sub
                       ? "border-[#A30404] bg-[#A30404] text-white shadow"
                       : "border-transparent hover:bg-[#CDC7BD]/40 text-[#04090C]"
                   }`}
                 >
                   {sub}
                 </button>
               ))}
             </div>
           </div>
         )}
       </div>
     </aside>

     {/* CONTENIDO PRINCIPAL */}
     <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-10 overflow-x-hidden pt-28 md:pt-10">
       {productosEstrella.length > 0 && (
         <section className="mt-6 mb-8 md:mb-12 w-full">
           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#590707] mb-4 sm:mb-6 md:mb-8">
             Destacados El Danés
           </h2>

           {/* CARRUSEL INFINITO */}
           <div className="relative mt-8 md:mt-12 w-full max-w-full">
             <div className="relative w-full">
               {/* BOTÓN IZQUIERDO */}
               <button
                 onClick={() => scrollCarousel("left")}
                 onMouseEnter={() => setPaused(true)}
                 onMouseLeave={() => setPaused(false)}
                 className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#590707] p-2 rounded-full shadow-lg transition items-center justify-center"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>

               {/* CAROUSEL */}
               <div
                 ref={carouselRef}
                 onMouseEnter={() => setPaused(true)}
                 onMouseLeave={() => setPaused(false)}
                 onTouchStart={() => setPaused(true)}
                 onTouchEnd={() => setPaused(false)}
                 className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto px-1 md:px-4 lg:px-12 w-full scrollbar-hide"
               >
                 {[
                   ...productosEstrella,
                   ...productosEstrella,
                   ...productosEstrella,
                 ].map((b, i) => {
                   const cats = Array.isArray(b.categorias)
                     ? b.categorias
                     : b.categoria
                     ? [b.categoria]
                     : [];

                   return (
                     <div
                       key={`carousel-${b._id}-${i}`}
                       className="bg-white rounded-lg md:rounded-xl border border-[#CDC7BD] p-2 md:p-3 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-56 sm:w-64 md:w-72 flex-shrink-0"
                     >
                       <div>
                         <img
                           src={b.imagen}
                           alt={b.nombre}
                           className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-lg mb-2 md:mb-3"
                           onError={(e) =>
                             (e.currentTarget.src =
                               "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen")
                           }
                         />

                         <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#04090C] mb-1 line-clamp-2">
                           {b.nombre}
                         </h3>

                         {cats.length > 0 && (
                           <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                             {cats.map((cat, idx) => (
                               <span
                                 key={idx}
                                 className="text-[10px] md:text-xs bg-[#CDC7BD] text-[#04090C] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full"
                               >
                                 {cat}
                               </span>
                             ))}
                           </div>
                         )}

                         {b.subcategoria && (
                           <span className="text-[10px] md:text-xs bg-[#A30404] text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-full inline-block mb-1 md:mb-2">
                             {b.subcategoria}
                           </span>
                         )}

                         <p className="text-[#736D66] text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">
                           {b.descripcion}
                         </p>

                         <p className="text-[#590707] font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">
                           ${fmt(b.precio)}
                         </p>
                       </div>

                       <button
                         onClick={() => handleAgregar(b)}
                         className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold transition mt-auto text-xs sm:text-sm md:text-base"
                       >
                         Agregar 🛒
                       </button>
                     </div>
                   );
                 })}
               </div>

               {/* BOTÓN DERECHO */}
               <button
                 onClick={() => scrollCarousel("right")}
                 onMouseEnter={() => setPaused(true)}
                 onMouseLeave={() => setPaused(false)}
                 className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#590707] p-2 rounded-full shadow-lg transition items-center justify-center"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
             </div>
           </div>

           {/* LÍNEA DIVISORIA */}
           <div className="border-t-2 border-[#CDC7BD] mt-6 md:mt-8"></div>
         </section>
       )}

       {/* CATÁLOGO */}
       <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#590707] mb-4 sm:mb-6 md:mb-8">
         Catálogo de Bebidas
       </h1>

       {bebidasFiltradas.length === 0 ? (
         <p className="text-center text-[#736D66] text-lg md:text-xl mt-10">
           No se encontraron bebidas con esos filtros.
         </p>
       ) : (
         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-full">
           {bebidasFiltradas.map((b) => {
             const cats = Array.isArray(b.categorias)
               ? b.categorias
               : b.categoria
               ? [b.categoria]
               : [];

             return (
               <div
                 key={b._id}
                 className="bg-white rounded-lg md:rounded-xl border border-[#CDC7BD] p-2 md:p-3 lg:p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1 flex flex-col justify-between w-full"
               >
                 <div>
                   <img
                     src={b.imagen}
                     alt={b.nombre}
                     className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg mb-2 md:mb-3"
                     onError={(e) =>
                       (e.currentTarget.src =
                         "https://placehold.co/600x400/CDC7BD/04090C?text=Sin+Imagen")
                     }
                   />

                   <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#04090C] mb-1 line-clamp-2">
                     {b.nombre}
                   </h3>

                   {cats.length > 0 && (
                     <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                       {cats.map((cat, idx) => (
                         <span
                           key={idx}
                           className="text-[10px] md:text-xs bg-[#CDC7BD] text-[#04090C] px-1.5 py-0.5 md:px-2 md:py-1 rounded-full"
                         >
                           {cat}
                         </span>
                       ))}
                     </div>
                   )}

                   {b.subcategoria && (
                     <span className="text-[10px] md:text-xs bg-[#A30404] text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-full inline-block mb-1 md:mb-2">
                       {b.subcategoria}
                     </span>
                   )}

                   <p className="text-[#736D66] text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">
                     {b.descripcion}
                   </p>

                   <p className="text-[#590707] font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-2 md:mb-3">
                     ${fmt(b.precio)}
                   </p>
                 </div>

                 <button
                   onClick={() => handleAgregar(b)}
                   className="bg-[#590707] hover:bg-[#A30404] text-white w-full py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold transition mt-auto text-xs sm:text-sm md:text-base"
                 >
                   Agregar 🛒
                 </button>
               </div>
             );
           })}
         </div>
       )}
     </main>
   </div>
 );
}
