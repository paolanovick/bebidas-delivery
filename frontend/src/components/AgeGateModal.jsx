import React, { useEffect, useState } from "react";

const AgeGateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const yaConfirmo = localStorage.getItem("ageVerified18");
    if (!yaConfirmo) {
      const t = setTimeout(() => setIsOpen(true), 500); // delay suave
      return () => clearTimeout(t);
    }
  }, []);

  const handleAceptar = () => {
    localStorage.setItem("ageVerified18", "true");
    setIsOpen(false);
  };

  const handleMenor = () => {
    // Podés cambiar esta URL si querés
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Glow estilo vinos */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_#A30404_0,_transparent_55%),radial-gradient(circle_at_bottom,_#04090C_0,_transparent_55%)] opacity-70" />

      <div className="relative z-10 max-w-md w-[90%] bg-[#04090C]/95 border border-[#CDC7BD]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-8 text-center text-[#F5F5F5]">
        <p className="tracking-[0.35em] text-xs uppercase text-[#CDC7BD] mb-3">
          Consumo responsable
        </p>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-[#FFFFFF]">
          ¿Sos mayor de 18 años?
        </h2>

        <p className="text-sm md:text-base text-[#E2DED5] mb-6 leading-relaxed">
          Este sitio vende bebidas alcohólicas. Para continuar, confirmá que sos
          mayor de edad.{" "}
          <span className="block mt-1 text-xs text-[#CDC7BD]">
            Si no lo sos, te pedimos que salgas del sitio. 💛
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={handleAceptar}
            className="flex-1 py-3 rounded-full text-sm font-semibold 
                       bg-[#A30404] hover:bg-[#590707] 
                       text-white shadow-lg shadow-[#A30404]/40 
                       transition transform hover:-translate-y-[1px]"
          >
            Sí, tengo 18 o más
          </button>

          <button
            onClick={handleMenor}
            className="flex-1 py-3 rounded-full text-sm font-semibold 
                       bg-transparent border border-[#CDC7BD]/60 
                       text-[#CDC7BD] hover:bg-[#CDC7BD]/10 
                       transition"
          >
            No, soy menor
          </button>
        </div>

        <p className="mt-5 text-[11px] text-[#A9A29A] leading-snug">
          Bebé con moderación. Prohibida su venta a menores de 18 años. <br />
          Al continuar, aceptás nuestros términos y condiciones.
        </p>
      </div>
    </div>
  );
};

export default AgeGateModal;
