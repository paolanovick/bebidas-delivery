import React from "react";
//import { useNavigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingCart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsuarioBebidas({ bebidas }) {
 // const { usuario } = useAuth();
 // const navigate = useNavigate();
  const { agregar } = useCarrito();

  const agregarAlCarrito = (bebida) => {
    //if (!usuario) {
      //toast.warning("Debes iniciar sesión para comprar 🧑‍💻");
      //setTimeout(() => navigate("/login"), 1200);
      //return;
   // }

    if (bebida.stock <= 0) {
      toast.error(`❗ "${bebida.nombre}" está sin stock`);
      return;
    }

    agregar(bebida);
    toast.success(`✅ ${bebida.nombre} agregado al carrito`);
  };

  return (
    <div className="relative bg-[#CDC7BD] min-h-screen p-6">
      <ToastContainer position="top-center" autoClose={1200} />

      <h1 className="text-4xl font-bold text-center mb-8 text-[#590707]">
        🍹 Catálogo de Bebidas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {bebidas.map((b) => (
          <div
            key={b._id}
            className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center text-center border border-[#CDC7BD] hover:border-[#590707] hover:shadow-2xl transition-all"
          >
            <img
              src={
                b.imagen ||
                "https://placehold.co/150/CDC7BD/04090C?text=Sin+Imagen"
              }
              alt={b.nombre}
              className="w-32 h-32 object-cover rounded-xl mb-3 border-2 border-[#CDC7BD]"
            />

            <h2 className="text-xl font-semibold text-[#04090C] mb-2">
              {b.nombre}
            </h2>

            <p className="text-2xl font-bold text-[#590707] mb-2">
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
              className="bg-[#590707] hover:bg-[#A30404] text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl w-full justify-center"
              disabled={b.stock < 1}
            >
              <ShoppingCart size={18} />
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
