import React from "react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();
  const ocultarEn = ["/admin", "/admin/", "/admin/login", "/login-admin"];
  const estaEnAdmin = location.pathname.startsWith("/admin");
  if (ocultarEn.includes(location.pathname) || estaEnAdmin) return null;

  const numero = "5492494252530";
  const mensaje = "Hola! Estoy viendo el menu y tengo una consulta";
  const mensajeCodificado = encodeURIComponent(mensaje);
  const webUrl = "https://wa.me/" + numero + "?text=" + mensajeCodificado;
  const appUrl = "whatsapp://send?phone=" + numero + "&text=" + mensajeCodificado;

  function abrirWhatsApp(e) {
    e.preventDefault();
    window.location.href = appUrl;
    setTimeout(function() {
      window.open(webUrl, "_blank");
    }, 1500);
  }

  return React.createElement("a", {
    href: webUrl,
    onClick: abrirWhatsApp,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "fixed bottom-5 right-5 bg-green-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform",
    style: {zIndex: 9999}
  }, React.createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    alt: "WhatsApp",
    className: "w-8 h-8"
  }));
};

export default WhatsAppButton;