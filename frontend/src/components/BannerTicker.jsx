import React from "react";

export default function BannerTicker() {
  return (
    <div
      className="w-full overflow-hidden py-2"
      style={{
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex animate-scroll whitespace-nowrap">
        <div className="flex gap-12 pr-12">
          <span className="text-sm font-semibold text-[#590707]">
            📦 Envío gratis en compras mayores a $40.000
          </span>
          <span className="text-sm font-semibold text-[#590707]">
            📦 Envío gratis en compras mayores a $40.000
          </span>
          <span className="text-sm font-semibold text-[#590707]">
            📦 Envío gratis en compras mayores a $40.000
          </span>
          <span className="text-sm font-semibold text-[#590707]">
            📦 Envío gratis en compras mayores a $40.000
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
