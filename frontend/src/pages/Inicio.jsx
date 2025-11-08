import React from "react";
import { Link } from "react-router-dom";

const Inicio = () => {
  return (
    <div className="h-screen w-full bg-[#04090C] flex flex-col items-center justify-center text-center">
      <img
        src={`${process.env.PUBLIC_URL}/logoSF.png`}
        alt="Logo"
         className="w-80 md:w-96 mb-8 animate-pulse"
      />
      <Link
        to="/tienda"
        className="text-2xl font-bold bg-[#CDC7BD] text-[#04090C] px-8 py-3 rounded-lg hover:bg-[#A30404] hover:text-white transition"
      >
        INGRESAR
      </Link>
    </div>
  );
};

export default Inicio;

