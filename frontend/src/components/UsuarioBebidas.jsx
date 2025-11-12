import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingCart } from "lucide-react";

export default function UsuarioBebidas({ bebidas }) {
  const { agregar } = useCarrito();
  const [mensaje, setMensaje] = React.useState("");

  const agregarAlCarrito = (bebida) => {
    if (bebida.stock <= 0) {
      setMensaje(`❗ "${bebida.nombre}" está sin stock`);
      setTimeout(() => setMensaje(""), 2000);
      return;
    }

    agregar(bebida);
    setMensaje(`✅ "${bebida.nombre}" agregada al carrito 🛒`);
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="relative bg-[#F7F5F2] min-h-screen p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-[#590707]">
        🍹 Catálogo de Bebidas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {bebidas.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow-lg rounded-xl p-4 md:p-5 flex flex-col items-center text-center border border-[#CDC7BD] hover:border-[#590707] hover:shadow-2xl transition-all"
          >
            <img
              src={
                b.imagen ||
                "https://placehold.co/150/CDC7BD/04090C?text=Sin+Imagen"
              }
              alt={b.nombre}
              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl mb-3 border-2 border-[#CDC7BD]"
            />

            <h2 className="text-lg md:text-xl font-semibold text-[#04090C] mb-2 line-clamp-2">
              {b.nombre}
            </h2>

            <p className="text-xl md:text-2xl font-bold text-[#590707] mb-2">
              ${b.precio}
            </p>

            <p
              className={`text-sm px-3 py-1 rounded-full mb-3 ${
                b.stock > 0
                  ? "text-[#04090C] bg-[#CDC7BD]"
                  : "text-white bg-red-600"
              }`}
            >
              {b.stock > 0 ? `Stock: ${b.stock}` : "Sin stock"}
            </p>

            <button
              onClick={() => agregarAlCarrito(b)}
              disabled={b.stock < 1}
              className="bg-[#590707] hover:bg-[#A30404] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <ShoppingCart size={18} />
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>

      {mensaje && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold text-center shadow-2xl z-[9999] transition-all duration-500 min-w-[250px] max-w-[80%] text-lg opacity-95 ${
            mensaje.includes("❗")
              ? "bg-red-600 animate-bounce"
              : "bg-green-600 animate-bounce"
          }`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}
