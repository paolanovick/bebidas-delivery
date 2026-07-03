import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IdCard, Phone, Send, Trophy, User, X } from "lucide-react";
import { getPublicidad } from "../services/api";

const DEFAULT_WHATSAPP = "5492494252530";

const crearClavePublicidad = (publicidad) =>
  [
    publicidad?._id || "publicidad",
    publicidad?.tipo || "imagen",
    publicidad?.updatedAt || publicidad?.imagenUrl || "sin-version",
  ].join(":");

const crearFormInicial = () => ({
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
});

export default function PublicidadModal() {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [publicidad, setPublicidad] = useState(null);
  const [form, setForm] = useState(crearFormInicial);
  const [errores, setErrores] = useState({});

  const location = useLocation();

  const publicidadMostradaHoy = (data) => {
    const guardado = localStorage.getItem("publicidad-mostrada");
    if (!guardado) return false;

    try {
      const datos = JSON.parse(guardado);
      return (
        datos.fecha === new Date().toDateString() &&
        datos.clave === crearClavePublicidad(data)
      );
    } catch {
      return false;
    }
  };

  const marcarComoMostradaHoy = (data) => {
    localStorage.setItem(
      "publicidad-mostrada",
      JSON.stringify({
        fecha: new Date().toDateString(),
        clave: crearClavePublicidad(data),
      })
    );
  };

  const cerrar = () => {
    setOpacity(0);
    setTimeout(() => setVisible(false), 250);
  };

  useEffect(() => {
    if (location.pathname !== "/tienda") return;

    const timers = [];

    const cargar = async () => {
      try {
        const data = await getPublicidad();
        const esFormulario = data.tipo === "formulario_envio_gratis";
        const sePuedeMostrar =
          data.activo && (esFormulario || Boolean(data.imagenUrl));

        if (!sePuedeMostrar || publicidadMostradaHoy(data)) return;

        timers.push(
          setTimeout(() => {
            setPublicidad(data);
            setForm(crearFormInicial());
            setErrores({});
            setVisible(true);
            timers.push(setTimeout(() => setOpacity(1), 50));

            if (!esFormulario) {
              timers.push(
                setTimeout(() => {
                  setOpacity(0);
                  timers.push(setTimeout(() => setVisible(false), 500));
                }, 3000)
              );
            }

            marcarComoMostradaHoy(data);
          }, 1200)
        );
      } catch (err) {
        console.error("Error al cargar publicidad:", err);
      }
    };

    cargar();

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [location.pathname]);

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: "" }));
  };

  const validar = () => {
    const nuevosErrores = {};
    const telefonoSoloDigitos = form.telefono.replace(/\D/g, "");
    const dniSoloDigitos = form.dni.replace(/\D/g, "");

    if (!form.nombre.trim()) nuevosErrores.nombre = "Ingresa tu nombre";
    if (!form.apellido.trim()) nuevosErrores.apellido = "Ingresa tu apellido";
    if (dniSoloDigitos.length < 7) nuevosErrores.dni = "Ingresa un DNI valido";
    if (telefonoSoloDigitos.length < 8)
      nuevosErrores.telefono = "Ingresa un telefono valido";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarWhatsApp = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const numero = String(publicidad.whatsappNumero || DEFAULT_WHATSAPP).replace(
      /\D/g,
      ""
    );
    const mensaje = `GANASTE UN ENVIO GRATIS POR EL GOL DE ARGENTINA

Nombre: ${form.nombre.trim()}
Apellido: ${form.apellido.trim()}
DNI: ${form.dni.trim()}
Telefono: ${form.telefono.trim()}

Quiero reclamar mi envio gratis.`;

    window.open(
      `https://wa.me/${numero || DEFAULT_WHATSAPP}?text=${encodeURIComponent(
        mensaje
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
    cerrar();
  };

  if (!visible || !publicidad) return null;

  const esFormulario = publicidad.tipo === "formulario_envio_gratis";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/65 backdrop-blur-md transition-opacity duration-300 ease-out px-4"
      style={{ opacity }}
    >
      {esFormulario ? (
        <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white text-[#04090C]">
          <button
            type="button"
            onClick={cerrar}
            className="absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 text-[#590707] flex items-center justify-center shadow hover:bg-white"
            aria-label="Cerrar publicidad"
          >
            <X size={20} />
          </button>

          <div className="relative bg-gradient-to-br from-sky-400 via-white to-sky-300 p-6 text-center overflow-hidden">
            <div className="absolute -left-10 top-8 w-24 h-24 rounded-full bg-sky-200/70" />
            <div className="absolute right-6 top-9 w-16 h-16 rounded-full bg-yellow-300 border-4 border-yellow-100 shadow-inner" />
            <div className="absolute -right-12 bottom-2 w-28 h-28 rounded-full bg-sky-200/70" />

            <div className="relative mx-auto w-16 h-16 rounded-full bg-white/95 border border-sky-200 flex items-center justify-center mb-4 shadow">
              <Trophy className="text-[#590707]" size={30} />
            </div>

            <h2 className="relative text-2xl sm:text-3xl font-black text-[#590707] leading-tight">
              {publicidad.titulo ||
                "GANASTE UN ENVIO GRATIS POR EL GOL DE ARGENTINA"}
            </h2>
            <p className="relative mt-3 text-sm text-[#04090C]">
              {publicidad.subtitulo ||
                "Completa tus datos y reclama tu beneficio por WhatsApp."}
            </p>
          </div>

          <form onSubmit={enviarWhatsApp} className="p-5 space-y-3">
            <CampoPromo
              icono={<User size={18} />}
              label="Nombre"
              value={form.nombre}
              error={errores.nombre}
              onChange={(value) => actualizarCampo("nombre", value)}
            />
            <CampoPromo
              icono={<User size={18} />}
              label="Apellido"
              value={form.apellido}
              error={errores.apellido}
              onChange={(value) => actualizarCampo("apellido", value)}
            />
            <CampoPromo
              icono={<IdCard size={18} />}
              label="DNI"
              value={form.dni}
              error={errores.dni}
              inputMode="numeric"
              onChange={(value) => actualizarCampo("dni", value)}
            />
            <CampoPromo
              icono={<Phone size={18} />}
              label="Telefono"
              value={form.telefono}
              error={errores.telefono}
              inputMode="tel"
              onChange={(value) => actualizarCampo("telefono", value)}
            />

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-[#590707] hover:bg-[#A30404] text-white font-bold flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {publicidad.botonTexto || "Enviar datos por WhatsApp"}
            </button>
          </form>
        </div>
      ) : (
        <div className="relative bg-white rounded-xl p-3 shadow-xl w-[90%] max-w-sm mx-auto">
          <button
            type="button"
            onClick={cerrar}
            className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white text-[#590707] flex items-center justify-center shadow"
            aria-label="Cerrar publicidad"
          >
            <X size={18} />
          </button>
          <img
            src={publicidad.imagenUrl}
            alt="Publicidad"
            className="rounded-lg w-full h-auto object-contain animate-zoomIn"
          />
        </div>
      )}
    </div>
  );
}

function CampoPromo({
  icono,
  label,
  value,
  error,
  onChange,
  inputMode = "text",
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#736D66] mb-1">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 ${
          error ? "border-red-400" : "border-[#CDC7BD]"
        }`}
      >
        <span className="text-sky-600">{icono}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          className="w-full py-2.5 outline-none text-[#04090C]"
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
