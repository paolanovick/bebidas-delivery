import React, { useEffect, useState } from "react";

const CLARITY_ID = "ukgtmxdoze";

function loadClarity() {
  if (window.clarity) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);
}

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      loadClarity();
    } else if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAceptar = () => {
    localStorage.setItem("cookie_consent", "accepted");
    loadClarity();
    setVisible(false);
  };

  const handleRechazar = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] flex justify-center px-4 pb-4">
      <div className="w-full max-w-2xl bg-[#04090C]/95 border border-[#CDC7BD]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] p-5 text-[#F5F5F5]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#CDC7BD] mb-1">
              Usamos cookies
            </p>
            <p className="text-xs text-[#A9A29A] leading-relaxed">
              Utilizamos cookies de análisis para mejorar tu experiencia en el sitio.
              Podés aceptarlas o rechazarlas. No compartimos tu información con terceros.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleRechazar}
              className="px-4 py-2 rounded-full text-xs font-semibold
                         bg-transparent border border-[#CDC7BD]/40
                         text-[#CDC7BD] hover:bg-[#CDC7BD]/10
                         transition"
            >
              Rechazar
            </button>
            <button
              onClick={handleAceptar}
              className="px-4 py-2 rounded-full text-xs font-semibold
                         bg-[#A30404] hover:bg-[#590707]
                         text-white shadow-lg shadow-[#A30404]/30
                         transition transform hover:-translate-y-[1px]"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
