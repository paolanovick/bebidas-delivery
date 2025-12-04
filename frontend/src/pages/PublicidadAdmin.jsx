import React, { useEffect, useState } from "react";
import { getPublicidad, actualizarPublicidad } from "../services/api";

export default function PublicidadAdmin() {
  const [imagenUrl, setImagenUrl] = useState("");
  const [activo, setActivo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ⭐ Conversor automático de Google Drive
  const convertirDrive = (url) => {
    if (!url.includes("drive.google.com")) return url;

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

        if (data) {
          setImagenUrl(data.imagenUrl || "");
          setActivo(data.activo ?? false);
        }
      } catch (err) {
        console.error("Error al cargar publicidad:", err);
      }
    };
    cargar();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();

    const urlFinal = convertirDrive(imagenUrl);

    try {
      await actualizarPublicidad({ imagenUrl: urlFinal, activo });
      setImagenUrl(urlFinal); // actualizar vista previa
      setMensaje("Publicidad actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-[#04090C]"> Publicidad</h2>

      {mensaje && (
        <div className="p-3 mb-4 rounded bg-green-200 text-green-800">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-4">
        <div>
          <label className="font-semibold text-[#04090C]">URL de imagen:</label>
          <input
            type="text"
            value={imagenUrl}
            onChange={(e) => setImagenUrl(e.target.value)}
            placeholder="Pegá un enlace de Google Drive"
            className="w-full p-2 rounded border border-[#736D66]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <label className="font-semibold text-[#04090C]">
            Activar publicidad
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#590707] text-white rounded-lg hover:bg-[#A30404]"
        >
          Guardar cambios
        </button>
      </form>

      {imagenUrl && (
        <div className="mt-6">
          <p className="font-semibold text-[#04090C] mb-2">Vista previa:</p>
          <img
            src={convertirDrive(imagenUrl)}
            alt="Publicidad"
            className="rounded-xl shadow border"
          />
        </div>
      )}
    </div>
  );
}
