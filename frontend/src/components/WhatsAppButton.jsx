import React from "react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();

  // Rutas donde NO debe aparecer
  const ocultarEn = ["/admin", "/admin/", "/admin/login", "/login-admin"];
  const estaEnAdmin = location.pathname.startsWith("/admin");

  if (ocultarEn.includes(location.pathname) || estaEnAdmin) return null;

  const numero = "549XXXXXXXXXX"; // ← CAMBIAR POR EL NÚMERO REAL
  const mensaje = encodeURIComponent(
    "Hola! Estoy viendo el menú y tengo una consulta 😊🍾"
  );

  const link = `https://wa.me/${numero}?text=${mensaje}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      style={{ zIndex: 9999 }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className="w-8 h-8"
      />
    </a>
  );
};

export default WhatsAppButton;
