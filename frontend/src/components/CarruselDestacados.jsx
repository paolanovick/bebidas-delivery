import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarruselDestacados({
  productos,
  handleAgregar,
  scrollCarousel,
  carouselRef,
  paused,
  setPaused,
  fmt,
}) {
  return (
    <section className="mt-6 mb-8 md:mb-12 w-full">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#590707] mb-4 sm:mb-6 md:mb-8">
        Destacados El Danés
      </h2>

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

          {/* CARRUSEL */}
          <div
            ref={carouselRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto px-1 md:px-4 lg:px-12 w-full scrollbar-hide"
          >
            {[...productos, ...productos, ...productos].map((b, i) => {
              const cats = Array.isArray(b.categorias)
                ? b.categorias
                : b.categoria
                ? [b.categoria]
                : [];

              return (
                <div
                  key={`carousel-${b._id}-${i}`}
                  className="relative w-56 sm:w-64 md:w-72 flex-shrink-0 overflow-visible"
                >
                  {/* CINTA DESTACADO */}
                  <div className="absolute -top-3 -left-3 z-20 rotate-[-15deg]">
                    <span className="bg-gradient-to-r from-[#A30404] to-[#590707] text-white text-[10px] md:text-xs font-bold px-3 py-1 shadow-lg rounded-sm tracking-wide uppercase">
                      Destacado
                    </span>
                  </div>

                  {/* TARJETA */}
                  <div
                    className="
                      bg-white rounded-lg md:rounded-xl border border-[#CDC7BD]
                      p-2 md:p-3 lg:p-5 shadow-sm hover:shadow-xl
                      transition hover:-translate-y-1
                      flex flex-col justify-between h-full
                    "
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

      <div className="border-t-2 border-[#CDC7BD] mt-6 md:mt-8"></div>
    </section>
  );
}
