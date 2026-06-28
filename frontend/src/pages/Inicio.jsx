import React from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { habilitarIngresoTienda } from "../utils/ingresoTienda";

const Inicio = () => {
  useSEO({
    title: "Bebidas & Delivery en Tandil",
    description:
      "El Danés: bebidas & delivery en Tandil. Pedí online tus bebidas favoritas, chequeá promos y novedades. Entrega rápida a domicilio.",
    url: "/",
  });

  return (
    <div className="h-screen w-full bg-[#04090C] flex flex-col items-center justify-center text-center">
      <img
        src={`${process.env.PUBLIC_URL}/logoSF.png`}
        alt="Logo"
         className="w-80 md:w-96 mb-8 animate-pulse"
      />
      <Link
        to="/tienda"
        onClick={habilitarIngresoTienda}
        className="text-2xl font-bold bg-[#CDC7BD] text-[#04090C] px-8 py-3 rounded-lg hover:bg-[#A30404] hover:text-white transition"
      >
        INGRESAR
      </Link>
    </div>
  );
};

export default Inicio;

