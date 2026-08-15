import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelarPedidoPendiente,
  getPedidoPorId,
  subirComprobantePago,
} from "../services/api";
import { useCarrito } from "../context/CarritoContext";

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ADMIN_WHATSAPP = "5492494252530";

export default function PagoAlias() {
  const { alias, pedidoId } = useParams();
  const navigate = useNavigate();
  const { vaciarCarrito } = useCarrito();
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
  const [previewUrl, setPreviewUrl] = useState("");
  const [comprobanteEnviado, setComprobanteEnviado] = useState(false);
  const [compartiendo, setCompartiendo] = useState(false);
  const [comprobanteCopiado, setComprobanteCopiado] = useState(false);
  const [imagenListaParaCopiar, setImagenListaParaCopiar] = useState(null);
  const [preparandoCopia, setPreparandoCopia] = useState(false);
  const [mercadoPagoAbierto, setMercadoPagoAbierto] = useState(false);
  const [detallePedido] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eldanesPagoPendiente") || "null");
    } catch {
      return null;
    }
  });
  const camaraInputRef = useRef(null);
  const galeriaInputRef = useRef(null);
  const comprobanteSectionRef = useRef(null);

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

  useEffect(() => {
    if (!archivo || !archivo.type.startsWith("image/")) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(archivo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [archivo]);

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
    setMercadoPagoAbierto(true);
    setStatus(
      `Alias ${alias} copiado. En Mercado Pago elegí Transferir e ingresá ese alias.`
    );
    window.open(
      "https://www.mercadopago.com.ar/home",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const irASubirComprobante = () => {
    comprobanteSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const prepararImagenParaCopiar = async (file) => {
    if (!file?.type?.startsWith("image/")) return null;
    if (file.type === "image/png") return file;

    try {
      const bitmap = await window.createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      context.drawImage(bitmap, 0, 0);
      bitmap.close?.();

      return await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });
    } catch {
      return null;
    }
  };

  const setArchivoComprobante = async (nextFile) => {
    if (!nextFile) return;
    if (nextFile.size > 3 * 1024 * 1024) {
      setArchivo(null);
      setImagenListaParaCopiar(null);
      setPasteError("El comprobante debe pesar menos de 3 MB.");
      return;
    }
    setArchivo(nextFile);
    setImagenListaParaCopiar(null);
    setPasteError("");
    setStatus("Comprobante listo para enviar");

    if (nextFile.type?.startsWith("image/")) {
      setPreparandoCopia(true);
      const imagenPreparada = await prepararImagenParaCopiar(nextFile);
      setImagenListaParaCopiar(imagenPreparada);
      setPreparandoCopia(false);
    }
  };

  const quitarComprobante = () => {
    setArchivo(null);
    setImagenListaParaCopiar(null);
    setPreparandoCopia(false);
    setStatus("");
    setPasteError("");
    if (camaraInputRef.current) camaraInputRef.current.value = "";
    if (galeriaInputRef.current) galeriaInputRef.current.value = "";
  };

  const copiarComprobanteAlPortapapeles = async (file) => {
    if (
      !file?.type?.startsWith("image/") ||
      !navigator.clipboard?.write ||
      !window.ClipboardItem
    ) {
      return false;
    }

    try {
      const item = new window.ClipboardItem({ "image/png": file });
      await navigator.clipboard.write([item]);
      return true;
    } catch {
      return false;
    }
  };

  const copiarComprobanteGuardado = async () => {
    const copiado = await copiarComprobanteAlPortapapeles(
      imagenListaParaCopiar
    );
    setComprobanteCopiado(copiado);
    setStatus(
      copiado
        ? "Comprobante copiado. Ahora abrí WhatsApp y pegalo en el chat."
        : "Este celular no permite copiar imágenes. Podés adjuntar la captura desde la galería."
    );
  };

  const cancelarYVolver = async () => {
    if (!window.confirm("¿Cancelar este pedido pendiente?")) return;

    try {
      await cancelarPedidoPendiente(pedidoId);
      localStorage.removeItem("eldanesPagoPendiente");
      vaciarCarrito();
      navigate("/tienda", { replace: true });
    } catch (cancelError) {
      alert(cancelError.message || "No se pudo cancelar el pedido");
    }
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
        "No se encontró una captura copiada. Probá con Elegir de galería."
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

  const descripcionPedidoWhatsapp = () => {
    const items = Array.isArray(detallePedido?.items)
      ? detallePedido.items
          .map(
            (item) =>
              `• ${item.nombre} x${item.cantidad} - $${(
                Number(item.precio || 0) * Number(item.cantidad || 0)
              ).toLocaleString("es-AR")}`
          )
          .join("\n")
      : "Detalle disponible en el panel de pedidos";

    const entrega = detallePedido?.direccion
      ? `\nEntrega: ${detallePedido.direccion}`
      : "";
    const telefono = detallePedido?.telefono
      ? `\nTeléfono: ${detallePedido.telefono}`
      : "";

    return `COMPROBANTE DE TRANSFERENCIA - EL DANÉS
Pedido #${String(pedidoId).slice(-6)}

${items}

Total: $${Number(pedido?.total || detallePedido?.total || 0).toLocaleString("es-AR")}${entrega}${telefono}

El comprobante también quedó guardado en el panel administrador.`;
  };

  const compartirPorWhatsapp = (copiado = comprobanteCopiado) => {
    const texto = descripcionPedidoWhatsapp();
    setCompartiendo(true);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
      copiado
        ? `${texto}\n\nLa captura está copiada. Mantené presionado en el chat y tocá Pegar.`
        : `${texto}\n\nAdjuntá en este chat la captura seleccionada.`
    )}`;

    setStatus(
      "Abriendo el WhatsApp de El Danés. Adjuntá allí la misma captura del comprobante."
    );
    window.location.assign(whatsappUrl);
  };

  const enviarComprobante = async (event) => {
    event.preventDefault();
    if (!archivo) {
      setPasteError("Primero sacá una foto o elegí la captura del comprobante.");
      return;
    }
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
      try {
        const pendiente = JSON.parse(
          localStorage.getItem("eldanesPagoPendiente") || "null"
        );
        if (pendiente?.pedidoId === pedidoId) {
          localStorage.removeItem("eldanesPagoPendiente");
        }
      } catch {
        localStorage.removeItem("eldanesPagoPendiente");
      }
      vaciarCarrito();
      setComprobanteEnviado(true);
    } catch (error) {
      setStatus(error.message || "No se pudo enviar el comprobante");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-white">Cargando...</p>;
  if (error)
    return (
      <div className="min-h-screen bg-[#CDC7BD] pt-28 px-4 text-[#04090C]">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 text-center">
          <p className="font-bold text-[#A30404]">No se pudo abrir este pedido</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            type="button"
            onClick={cancelarYVolver}
            className="mt-5 rounded-xl bg-[#590707] px-5 py-3 font-bold text-white"
          >
            Cancelar aviso y volver a la tienda
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#CDC7BD] text-[#04090C] pt-24 md:pt-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6 border border-[#e6e2dc] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/tienda")}
            className="self-start rounded-lg border-2 border-[#590707] px-4 py-2 text-sm font-bold text-[#590707]"
          >
            Volver a la tienda
          </button>
          <p className="text-xs text-[#5b5b5b] sm:text-right">
            Tu pedido ya está guardado. Podés volver y continuar el pago después.
          </p>
        </div>

        <button
          type="button"
          onClick={cancelarYVolver}
          className="text-sm font-bold text-[#A30404] underline"
        >
          Cancelar este pedido
        </button>

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

        {mercadoPagoAbierto && !comprobanteEnviado && (
          <section className="rounded-2xl border-2 border-[#009ee3] bg-[#f1fbff] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#04090C]">
              Cuando termines de pagar, volvé a esta pantalla
            </h2>
            <p className="mt-1 text-sm text-[#425466]">
              Guardá o sacá una captura del comprobante de Mercado Pago.
            </p>
            <button
              type="button"
              onClick={irASubirComprobante}
              className="mt-4 w-full min-h-[56px] rounded-xl bg-[#009ee3] px-5 py-3 text-lg font-bold text-white"
            >
              Ya pagué, subir comprobante
            </button>
          </section>
        )}

        {status && <p className="text-sm text-[#590707] font-semibold">{status}</p>}

        {comprobanteEnviado && (
          <section className="rounded-2xl border-2 border-green-600 bg-green-50 p-5 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-green-800">
                Comprobante guardado en la página
              </h2>
              <p className="text-sm text-[#04090C] mt-1">
                Ahora envialo por WhatsApp para que el cadete lo tenga junto con el pedido.
              </p>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Comprobante listo para WhatsApp"
                className="w-full max-h-64 rounded-xl object-contain bg-white border"
              />
            )}

            <button
              type="button"
              onClick={copiarComprobanteGuardado}
              disabled={preparandoCopia}
              className="w-full min-h-[58px] rounded-xl bg-[#590707] px-5 py-3 text-lg font-bold text-white disabled:opacity-60"
            >
              {preparandoCopia
                ? "Preparando captura..."
                : comprobanteCopiado
                ? "Comprobante copiado"
                : "Copiar comprobante"}
            </button>

            <button
              type="button"
              onClick={() => compartirPorWhatsapp()}
              disabled={compartiendo}
              className="w-full min-h-[58px] rounded-xl bg-green-600 px-5 py-3 text-lg font-bold text-white disabled:opacity-60"
            >
              {compartiendo
                ? "Abriendo WhatsApp..."
                : "Abrir WhatsApp de El Danés"}
            </button>
            <p className="text-xs text-[#5b5b5b]">
              {comprobanteCopiado
                ? "En WhatsApp mantené presionado en el chat, tocá Pegar y enviá la imagen."
                : "Primero copiá el comprobante. Después abrí directamente el chat de El Danés."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/tienda", { replace: true })}
              className="w-full rounded-xl border-2 border-[#590707] px-5 py-3 font-bold text-[#590707] bg-white"
            >
              Volver a la tienda
            </button>
          </section>
        )}

        <form
          onSubmit={enviarComprobante}
          className={comprobanteEnviado ? "hidden" : "space-y-3"}
        >
          <label className="block text-sm">
            Referencia de transferencia (opcional)
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-[#04090C]"
              placeholder="Ej.: N° de operación o alias emisor"
            />
          </label>

          <section
            ref={comprobanteSectionRef}
            className="scroll-mt-24 rounded-2xl border-2 border-[#e2ddd6] bg-[#faf9f7] p-4 space-y-4"
          >
            <div>
              <h2 className="font-bold text-[#590707]">Subí el comprobante</h2>
              <p className="text-xs text-[#5b5b5b] mt-1">
                Elegí la captura desde tus fotos o sacale una foto al comprobante.
              </p>
            </div>

            <input
              ref={camaraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setArchivoComprobante(e.target.files?.[0] || null)}
              className="hidden"
            />
            <input
              ref={galeriaInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setArchivoComprobante(e.target.files?.[0] || null)}
              className="hidden"
            />

            {!archivo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => camaraInputRef.current?.click()}
                  className="min-h-[58px] rounded-xl bg-[#590707] text-white px-4 py-3 font-bold shadow-sm"
                >
                  Tomar foto
                </button>
                <button
                  type="button"
                  onClick={() => galeriaInputRef.current?.click()}
                  className="min-h-[58px] rounded-xl border-2 border-[#590707] bg-white text-[#590707] px-4 py-3 font-bold"
                >
                  Elegir de galería
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border-2 border-green-600 bg-white">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa del comprobante"
                    className="w-full max-h-72 object-contain bg-[#eeeae4]"
                  />
                ) : (
                  <div className="min-h-[120px] flex items-center justify-center bg-[#eeeae4] p-5 text-center font-semibold">
                    PDF listo para enviar
                  </div>
                )}
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-green-700">Comprobante listo</p>
                    <p className="text-xs text-[#5b5b5b] truncate">
                      {archivo.name || "captura"} · {(archivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={quitarComprobante}
                    className="shrink-0 rounded-lg border border-[#A30404] px-3 py-2 text-xs font-bold text-[#A30404]"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-[#ddd8d1] pt-3">
              <button
                type="button"
                onClick={pegarDesdePortapapeles}
                className="text-sm font-semibold text-[#590707] underline"
              >
                Pegar una captura copiada
              </button>
              <div
                onPaste={pegarDesdeEvento}
                tabIndex={0}
                className="sr-only"
                aria-label="Zona para pegar comprobante"
              />
              <p className="text-xs text-[#736D66] mt-1">
                Esta opción funciona principalmente en computadora.
              </p>
            </div>

            {pasteError && (
              <p className="text-sm font-semibold text-red-600">{pasteError}</p>
            )}
          </section>

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
            disabled={enviando || !archivo || preparandoCopia}
            className="w-full min-h-[54px] bg-[#590707] text-white px-4 py-3 rounded-xl font-bold disabled:opacity-40"
          >
            {preparandoCopia
              ? "Preparando captura..."
              : enviando
              ? "Enviando..."
              : archivo
              ? "Guardar comprobante"
              : "Seleccioná un comprobante"}
          </button>
        </form>
      </div>
    </div>
  );
}
