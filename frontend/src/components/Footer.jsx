// src/components/Footer.jsx
import React, { useState } from "react";
import { Mail, Facebook, Instagram, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Estado para el email del newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMensaje, setNewsletterMensaje] = useState("");

  const handleShare = () => {
    const url = window.location.origin;
    const title = "EL DANES Bebidas & Delivery";

    if (navigator.share) {
      navigator
        .share({
          title,
          text: "Te comparto la web de EL DANES Bebidas & Delivery 🍷",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      alert("Enlace copiado al portapapeles ✅");
    }
  };

  // 👉 ACA se llama al webhook de n8n
  const handleNewsletter = async () => {
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterMensaje("Ingresá un email válido 🙏");
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterMensaje("");

      const res = await fetch(
        "https://n8n.triptest.com.ar/webhook/suscripcionNL",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newsletterEmail,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error en el servidor");
      }

      setNewsletterMensaje("¡Listo! Te suscribimos al newsletter ✅");
      setNewsletterEmail("");
    } catch (error) {
      console.error("Error al suscribirse:", error);
      setNewsletterMensaje(
        "Hubo un problema al suscribirte. Probá de nuevo en unos minutos 🙇‍♀️"
      );
    } finally {
      setNewsletterLoading(false);
    }
  };

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
            EL DANES Bebidas & Delivery · Tandil, Buenos Aires, Argentina.
          </p>

          {/* Redes Sociales */}
          <div className="flex gap-4 mt-2">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/ivanito10?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#590707] transition"
            >
              <Facebook size={22} />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/bebidaseldanes/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#590707] transition"
            >
              <Instagram size={22} />
            </a>

            {/* Compartir */}
            <button
              type="button"
              onClick={handleShare}
              className="hover:text-[#590707] transition"
              title="Compartir sitio"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>

        {/* Columna 2 - Secciones */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#590707]">
            Secciones
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/tienda"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                to="/tienda"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Ofertas
              </Link>
            </li>
            <li>
              <a
                href="mailto:eldanes.tandil@gmail.com"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3 - Políticas */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#590707]">
            Políticas
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a
                href="/docs/terminos-condiciones.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a
                href="/docs/politica-privacidad.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Política de Privacidad
              </a>
            </li>
            <li>
              <a
                href="/docs/envios-devoluciones.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Envíos y Devoluciones
              </a>
            </li>
            <li>
              <a
                href="/docs/preguntas-frecuentes.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#590707] cursor-pointer transition"
              >
                Preguntas Frecuentes
              </a>
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
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#590707] focus:outline-none focus:border-[#A30404] bg-white text-[#04090C]"
            />
            <button
              className="bg-[#590707] hover:bg-[#A30404] transition text-white px-4 py-2 rounded-lg shadow-md disabled:bg-[#736D66]"
              type="button"
              onClick={handleNewsletter}
              disabled={newsletterLoading}
            >
              {newsletterLoading ? (
                <span className="text-xs px-2">...</span>
              ) : (
                <Mail size={18} />
              )}
            </button>
          </div>

          {newsletterMensaje && (
            <p className="mt-2 text-xs text-[#04090C]">{newsletterMensaje}</p>
          )}
        </div>
      </div>

      <div className="text-center py-4 border-t border-[#590707] text-sm">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://concodigoart.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#590707] font-semibold hover:underline hover:text-[#A30404] transition"
        >
          Con Código Art
        </a>{" "}
        - Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
