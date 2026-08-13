import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPedidoPorId, subirComprobantePago } from "../services/api";

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function PagoAlias() {
  const { alias, pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [comentario, setComentario] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [status, setStatus] = useState("");
  const [pasteError, setPasteError] = useState("");
  const [origenTransferencia, setOrigenTransferencia] = useState("banco");

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const data = await getPedidoPorId(pedidoId);
        setPedido(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el pedido");
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) {
      cargarPedido();
    }
  }, [pedidoId]);

  const copyAlias = async () => {
    try {
      await navigator.clipboard.writeText(alias);
      setStatus("Alias copiado");
      setTimeout(() => setStatus(""), 1600);
    } catch {
      setStatus("No se pudo copiar el alias");
      setTimeout(() => setStatus(""), 1600);
    }
  };

  const abrirMercadoPago = () => {
    navigator.clipboard?.writeText(alias).catch(() => {});
    setOrigenTransferencia("mercadopago");
    setStatus(
      `Alias ${alias} copiado. En Mercado Pago elegí Transferir e ingresá ese alias.`
    );
    window.open(
      "https://www.mercadopago.com.ar/home",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const setArchivoComprobante = (nextFile) => {
    if (!nextFile) return;
    if (nextFile.size > 3 * 1024 * 1024) {
      setArchivo(null);
      setPasteError("El comprobante debe pesar menos de 3 MB.");
      return;
    }
    setArchivo(nextFile);
    setPasteError("");
    setStatus(`Archivo listo: ${nextFile.name || "captura"} (${(
      nextFile.size /
      1024 /
      1024
    ).toFixed(2)} MB)`);
  };

  const pegarDesdePortapapeles = async () => {
    setPasteError("");
    setStatus("");

    try {
      const items = await navigator.clipboard.read();
      const imagen = items.find((entry) => entry.types?.some((type) => type.startsWith("image/")));

      if (!imagen) {
        throw new Error("No se encontró una imagen en el portapapeles.");
      }

      const tipoImagen = imagen.types.find((type) => type.startsWith("image/"));
      const blob = await imagen.getType(tipoImagen || "image/png");
      const file = new File([blob], `comprobante-${Date.now()}.png`, {
        type: tipoImagen || "image/png",
      });
      if (!file) throw new Error("No se pudo convertir la imagen del portapapeles.");

      setArchivoComprobante(file);
    } catch (error) {
      setPasteError(
        "No se pudo pegar automáticamente. Tocá el recuadro y pegá (Ctrl+V) o usá \"Adjuntar comprobante\"."
      );
      setTimeout(() => setPasteError(""), 2600);
    }
  };

  const pegarDesdeEvento = (event) => {
    event.preventDefault();
    const items = Array.from(event.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image/"));

    if (!imageItem) {
      setPasteError("Pegá una imagen (captura) y vuelve a intentar.");
      setTimeout(() => setPasteError(""), 2200);
      return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      setPasteError("No se pudo leer la imagen del portapapeles.");
      setTimeout(() => setPasteError(""), 2200);
      return;
    }

    setArchivoComprobante(file);
  };

  const enviarComprobante = async (event) => {
    event.preventDefault();
    setStatus("");
    setEnviando(true);

      try {
        let comprobanteBase64 = "";
        if (archivo) {
          comprobanteBase64 = await toBase64(archivo);
        }

      await subirComprobantePago(pedidoId, {
        metodoPago: "transferencia",
        aliasPago: alias,
        referenciaPago: referencia.trim(),
        comentarioPago: comentario.trim(),
        comprobanteBase64,
        comprobanteNombre: archivo?.name,
        comprobanteTipo: archivo?.type,
      });

      setStatus("Comprobante enviado. Te avisamos cuando confirmemos el pago.");
      setReferencia("");
      setComentario("");
      setArchivo(null);
    } catch (error) {
      setStatus(error.message || "No se pudo enviar el comprobante");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-white">Cargando...</p>;
  if (error)
    return <p className="p-6 text-center text-red-300">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-[#CDC7BD] text-[#04090C] pt-24 md:pt-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 border border-[#e6e2dc] space-y-5">
        <h1 className="text-2xl font-bold text-[#590707]">
          Pago por transferencia
        </h1>

        <p className="text-sm">
          Monto a pagar:{" "}
          <strong>${Number(pedido?.total || 0).toLocaleString("es-AR")}</strong>
        </p>
        <p className="text-sm">
          Estado de pago actual: <strong>{pedido?.estadoPago || "pendiente"}</strong>
        </p>

        <section className="space-y-3">
          <h2 className="font-semibold text-[#590707]">
            Elegí desde dónde vas a transferir
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setOrigenTransferencia("banco")}
              className={`rounded-xl border-2 p-4 text-left transition ${
                origenTransferencia === "banco"
                  ? "border-[#590707] bg-[#fff7f5]"
                  : "border-[#ddd8d1] bg-white"
              }`}
            >
              <span className="block font-bold">Transferencia bancaria</span>
              <span className="block text-xs mt-1 text-[#5b5b5b]">
                Usá la aplicación de tu banco y transferí al alias.
              </span>
            </button>

            <button
              type="button"
              onClick={abrirMercadoPago}
              className={`rounded-xl border-2 p-4 text-left transition ${
                origenTransferencia === "mercadopago"
                  ? "border-[#009ee3] bg-[#f1fbff]"
                  : "border-[#ddd8d1] bg-white"
              }`}
            >
              <span className="block font-bold">Abrir Mercado Pago</span>
              <span className="block text-xs mt-1 text-[#5b5b5b]">
                Abre Mercado Pago para hacer una transferencia común.
              </span>
            </button>
          </div>

          <div className="rounded-xl bg-[#f3f0eb] p-4">
            <p className="text-xs uppercase tracking-wide text-[#736D66]">
              Alias de destino
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <strong className="text-lg break-all">{alias}</strong>
              <button
                onClick={copyAlias}
                className="text-sm bg-[#590707] text-white px-3 py-1.5 rounded"
                type="button"
              >
                Copiar alias
              </button>
            </div>
            <p className="text-xs mt-2 text-[#5b5b5b]">
              {origenTransferencia === "mercadopago"
                ? "En Mercado Pago tocá Transferir, buscá este alias y enviá el monto indicado. Después volvé para subir el comprobante."
                : "Abrí la app de tu banco, transferí al alias y después volvé para subir el comprobante."}
            </p>
          </div>
        </section>

        {status && <p className="text-sm text-[#590707] font-semibold">{status}</p>}

        <form onSubmit={enviarComprobante} className="space-y-3">
          <label className="block text-sm">
            Referencia de transferencia (opcional)
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-[#04090C]"
              placeholder="Ej.: N° de operación o alias emisor"
            />
          </label>

          <label className="block text-sm">
            Adjuntar comprobante (foto o captura)
            <button
              type="button"
              onClick={pegarDesdePortapapeles}
              className="ml-2 text-sm bg-[#736D66] text-white px-3 py-1 rounded"
            >
              Pegar comprobante
            </button>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setArchivoComprobante(e.target.files?.[0] || null)}
              className="w-full mt-1 text-sm"
            />
            <div
              onPaste={pegarDesdeEvento}
              tabIndex={0}
              role="button"
              className="w-full mt-2 p-3 border-2 border-dashed border-[#A30404] rounded text-xs text-center text-[#5b5b5b] cursor-pointer"
            >
              Tocá aquí y pegá la captura (Ctrl + V)
            </div>
            {pasteError && (
              <p className="text-xs text-red-600 mt-1">{pasteError}</p>
            )}
          </label>

          <label className="block text-sm">
            Comentario
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-[#04090C]"
              rows={3}
              placeholder="Ej.: Se transfirió desde app bancaria"
            />
          </label>

        <button
            type="submit"
            disabled={enviando}
            className="bg-[#590707] text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Subir comprobante"}
          </button>
        </form>
      </div>
    </div>
  );
}
