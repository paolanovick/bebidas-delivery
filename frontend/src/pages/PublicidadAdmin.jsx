import React, { useEffect, useState } from "react";
import { Image, Save, Trophy } from "lucide-react";
import { getPublicidad, actualizarPublicidad } from "../services/api";

const DEFAULT_PROMO = {
  imagenUrl: "",
  activo: false,
  tipo: "imagen",
  titulo: "GANASTE UN ENVIO GRATIS POR EL GOL DE ARGENTINA",
  subtitulo: "Completa tus datos y reclama tu beneficio por WhatsApp.",
  botonTexto: "Enviar datos por WhatsApp",
  whatsappNumero: "5492494252530",
};

export default function PublicidadAdmin() {
  const [form, setForm] = useState(DEFAULT_PROMO);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const convertirDrive = (url) => {
    if (!url || !url.includes("drive.google.com")) return url;

    try {
      const match = url.match(/\/d\/(.*?)\//);
      if (!match || !match[1]) return url;

      const id = match[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    } catch (e) {
      console.error("Error convirtiendo URL de Drive:", e);
      return url;
    }
  };

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getPublicidad();
        setForm({
          ...DEFAULT_PROMO,
          ...data,
          tipo: data.tipo || "imagen",
        });
      } catch (err) {
        console.error("Error al cargar publicidad:", err);
      }
    };

    cargar();
  }, []);

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);

    const payload = {
      ...form,
      imagenUrl: convertirDrive(form.imagenUrl),
      whatsappNumero: String(form.whatsappNumero || "").replace(/\D/g, ""),
    };

    try {
      const data = await actualizarPublicidad(payload);
      setForm({
        ...DEFAULT_PROMO,
        ...(data.publicidad || payload),
      });
      setMensaje("Publicidad guardada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error(err);
      setMensaje(err.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-5xl text-[#04090C]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Publicidad</h2>
          <p className="text-sm text-[#736D66]">
            Flyer, imagen o formulario promocional.
          </p>
        </div>

        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => actualizarCampo("activo", e.target.checked)}
          />
          Activar publicidad
        </label>
      </div>

      {mensaje && (
        <div
          className={`p-3 mb-4 rounded ${
            mensaje.toLowerCase().includes("error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-800"
          }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleGuardar} className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-5">
          <div>
            <p className="font-semibold mb-2">Tipo de publicidad</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => actualizarCampo("tipo", "imagen")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${
                  form.tipo === "imagen"
                    ? "bg-[#590707] text-white border-[#590707]"
                    : "bg-white text-[#04090C] border-[#CDC7BD]"
                }`}
              >
                <Image size={18} />
                Imagen
              </button>

              <button
                type="button"
                onClick={() =>
                  actualizarCampo("tipo", "formulario_envio_gratis")
                }
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${
                  form.tipo === "formulario_envio_gratis"
                    ? "bg-[#590707] text-white border-[#590707]"
                    : "bg-white text-[#04090C] border-[#CDC7BD]"
                }`}
              >
                <Trophy size={18} />
                Promo gol
              </button>
            </div>
          </div>

          {form.tipo === "imagen" ? (
            <div>
              <label className="font-semibold">URL de imagen</label>
              <input
                type="text"
                value={form.imagenUrl}
                onChange={(e) => actualizarCampo("imagenUrl", e.target.value)}
                placeholder="Pega un enlace de Google Drive o una URL directa"
                className="w-full p-2 rounded border border-[#736D66] mt-1"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Titulo</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => actualizarCampo("titulo", e.target.value)}
                  className="w-full p-2 rounded border border-[#736D66] mt-1"
                />
              </div>

              <div>
                <label className="font-semibold">Texto secundario</label>
                <textarea
                  value={form.subtitulo}
                  onChange={(e) => actualizarCampo("subtitulo", e.target.value)}
                  className="w-full p-2 rounded border border-[#736D66] mt-1 min-h-24"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Boton</label>
                  <input
                    type="text"
                    value={form.botonTexto}
                    onChange={(e) =>
                      actualizarCampo("botonTexto", e.target.value)
                    }
                    className="w-full p-2 rounded border border-[#736D66] mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold">WhatsApp destino</label>
                  <input
                    type="text"
                    value={form.whatsappNumero}
                    onChange={(e) =>
                      actualizarCampo("whatsappNumero", e.target.value)
                    }
                    className="w-full p-2 rounded border border-[#736D66] mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="w-full py-3 bg-[#590707] text-white rounded-lg hover:bg-[#A30404] disabled:opacity-60 flex items-center justify-center gap-2 font-semibold"
          >
            <Save size={18} />
            {guardando ? "Guardando..." : "Guardar y disparar"}
          </button>
        </div>

        <div>
          <p className="font-semibold mb-2">Vista previa</p>
          {form.tipo === "imagen" ? (
            form.imagenUrl ? (
              <img
                src={convertirDrive(form.imagenUrl)}
                alt="Publicidad"
                className="rounded-xl shadow border w-full bg-white"
              />
            ) : (
              <div className="h-80 rounded-xl border border-dashed border-[#CDC7BD] flex items-center justify-center text-[#736D66]">
                Sin imagen
              </div>
            )
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-xl border border-sky-200 bg-white">
              <div className="bg-gradient-to-br from-sky-400 via-white to-sky-300 p-5 text-center relative">
                <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-yellow-300 shadow-inner border-4 border-yellow-100" />
                <div className="relative mx-auto w-16 h-16 rounded-full bg-white/90 border border-sky-200 flex items-center justify-center mb-3">
                  <Trophy className="text-[#590707]" size={30} />
                </div>
                <h3 className="relative text-2xl font-black text-[#590707] leading-tight">
                  {form.titulo}
                </h3>
                <p className="relative mt-2 text-sm text-[#04090C]">
                  {form.subtitulo}
                </p>
              </div>

              <div className="p-5 space-y-3">
                {["Nombre", "Apellido", "DNI", "Telefono"].map((label) => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-[#736D66]">
                      {label}
                    </label>
                    <div className="h-10 rounded-lg border border-[#CDC7BD] bg-gray-50" />
                  </div>
                ))}

                <div className="rounded-lg bg-[#590707] text-white text-center py-3 font-semibold">
                  {form.botonTexto}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
