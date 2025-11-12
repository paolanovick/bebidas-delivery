import React from "react";

const Registro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#CDC7BD] text-center p-6">
      <h1 className="text-3xl font-bold text-[#590707] mb-4">
        🚫 Registro deshabilitado
      </h1>
      <p className="text-lg text-[#04090C] max-w-md">
        Actualmente el registro de nuevos usuarios está desactivado.
        Solo el administrador puede acceder al sistema.
      </p>
    </div>
  );
};

export default Registro;
