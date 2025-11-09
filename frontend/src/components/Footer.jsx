import React from "react";
import { Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#CDC7BD] text-[#04090C] border-t border-[#590707] mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Columna 1 - Logo + Redes */}
        <div className="flex flex-col items-start gap-4">
          <img
            src="/logoSF.png"
            alt="Logo"
            className="w-32 h-auto object-contain drop-shadow-md"
          />
          <p className="text-sm leading-relaxed">
            Bebidas seleccionadas con amor 🍷 Calidad, sabor y buena onda.
          </p>

          {/* Redes Sociales */}
          <div className="flex gap-4 mt-2">
            <button className="hover:text-[#590707] transition">
              <Facebook size={22} />
            </button>
            <button className="hover:text-[#590707] transition">
              <Instagram size={22} />
            </button>
            <button className="hover:text-[#590707] transition">
              <Twitter size={22} />
            </button>
          </div>
        </div>

        {/* Columna 2 - Secciones */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#590707]">
            Secciones
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-[#590707] cursor-pointer transition">
              Inicio
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Catálogo
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Ofertas
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Contacto
            </li>
          </ul>
        </div>

        {/* Columna 3 - Políticas */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#590707]">
            Políticas
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="hover:text-[#590707] cursor-pointer transition">
              Términos y Condiciones
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Política de Privacidad
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Envíos y Devoluciones
            </li>
            <li className="hover:text-[#590707] cursor-pointer transition">
              Preguntas Frecuentes
            </li>
          </ul>
        </div>

        {/* Columna 4 - Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#590707]">
            Suscribite al Newsletter
          </h3>
          <p className="text-sm mb-3">
            Enterate primero de nuevas bebidas y promos exclusivas ✨
          </p>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Tu email..."
              className="w-full px-3 py-2 rounded-lg border border-[#590707] focus:outline-none focus:border-[#A30404]"
            />
            <button className="bg-[#590707] hover:bg-[#A30404] transition text-white px-4 py-2 rounded-lg shadow-md">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-[#590707] text-sm">
        © {new Date().getFullYear()} Mi Tienda - Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
