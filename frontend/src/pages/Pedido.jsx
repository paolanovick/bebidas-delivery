import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCarrito } from "../context/CarritoContext";
import { useSEO } from "../hooks/useSEO";
import { crearPedido, getEnvioConfig } from "../services/api";
import { ShoppingCart, Trash2, Send } from "lucide-react";
import IncentivoPedido from "../components/IncentivoPedido";
// ✅ AGREGAR ESTA LÍNEA
const ADMIN_WHATSAPP = "5492494252530";

export default function Pedido() {
  const navigate = useNavigate();
  const [pagoPendiente] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eldanesPagoPendiente") || "null");
    } catch {
      return null;
    }
  });

  useSEO({
    title: "Tu Pedido",
    description:
      "Revisá tu pedido y completá la entrega. El Danés — Bebidas & Delivery en Tandil.",
    url: "/pedido",
  });

  // carrito
  const { carrito, guardarCarrito, vaciarCarrito } = useCarrito();

  // 🔹 modo de entrega primero
  const [modoEntrega, setModoEntrega] = useState("envio");

  // 🔹 configuración dinámica del envío (desde backend)
  const [configEnvio, setConfigEnvio] = useState({
    costoEnvio: 0,
    montoMinimoEnvioGratis: 40000,
    envioHabilitado: true,
  });

  // CARGAR CONFIGURACIÓN DE ENVÍO
  useEffect(() => {
    async function cargarConfig() {
      try {
        const data = await getEnvioConfig();
        setConfigEnvio(data);
      } catch (err) {
        console.error("Error cargando config de envío", err);
      }
    }
    cargarConfig();
  }, []);

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return eliminarItem(id);
    const itemActual = carrito.find((item) => (item._id || item.id) === id);
    const controlaStock =
      itemActual?.origenCarrito !== "tienda" && !itemActual?.ventaSinControlStock;
    const stockDisponible = Number(itemActual?.stock) || 0;

    if (controlaStock && stockDisponible > 0 && nuevaCantidad > stockDisponible) {
      alert(`No hay más stock disponible. Stock: ${stockDisponible}`);
      return;
    }

    const actualizado = carrito.map((item) =>
      (item._id || item.id) === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    guardarCarrito(actualizado);
  };

  const eliminarItem = (id) => {
    const nuevo = carrito.filter((item) => (item._id || item.id) !== id);
    guardarCarrito(nuevo);
  };

  // 🍷 Subtotal
  const subtotal = carrito.reduce(
    (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
    0
  );

  // 🚚 Costo envío dinámico
  const COSTO_ENVIO = Number(configEnvio.costoEnvio) || 0;
  const montoConfiguradoEnvioGratis = Number(
    configEnvio.montoMinimoEnvioGratis
  );
  const MONTO_ENVIO_GRATIS =
    Number.isFinite(montoConfiguradoEnvioGratis) &&
    montoConfiguradoEnvioGratis > 0
      ? montoConfiguradoEnvioGratis
      : 40000;
  const envioHabilitado =
    configEnvio.envioHabilitado ?? configEnvio.activo ?? true;

  // Si subtotal alcanza el mínimo configurado o es takeaway, no se cobra envío.
  const costoEnvio =
    modoEntrega === "takeaway" || subtotal >= MONTO_ENVIO_GRATIS
      ? 0
      : modoEntrega === "envio" && envioHabilitado
      ? COSTO_ENVIO
      : 0;
  // 💰 Total final
  const total = subtotal + costoEnvio;

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [coordenadas, setCoordenadas] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [procesando, setProcesando] = useState(false);

  // ubicacion GPS
  useEffect(() => {
    if (!coordenadas && "geolocation" in navigator && modoEntrega === "envio") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordenadas({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [coordenadas, modoEntrega]);

  // VALIDACIONES
  const telSoloDigitos = telefono.replace(/\D/g, "");
  const validoDireccion = direccion.trim().length >= 5;

  const requiereDireccion = modoEntrega === "envio";
  const validoTelefono = telefono === "" || telSoloDigitos.length >= 10;
  const validoEmail = email === "" || email.includes("@");

  const puedeConfirmar =
    carrito.length > 0 &&
    !pagoPendiente?.pedidoId &&
    validoTelefono &&
    validoEmail &&
    (!requiereDireccion || validoDireccion) &&
    !procesando;

  const confirmarYEnviar = async () => {
    if (!puedeConfirmar) return;
    setProcesando(true);
    const aliasTransferencia = "eldanestandil";

    const pedido = {
      emailCliente: email,
      items: carrito.map((i) => ({
        bebida: i._id || i.id,
        nombre: i.nombre || i.titulo,
        precio: Number(i.precio) || 0,
        cantidad: Number(i.cantidad) || 0,
        origenCarrito: i.origenCarrito || "catalogo",
        ventaSinControlStock: Boolean(i.ventaSinControlStock),
      })),
      modoEntrega,
      direccionEntrega:
        modoEntrega === "envio" ? direccion : "Retira en el local (take away)",
      telefono,
      coordenadas: modoEntrega === "envio" ? coordenadas : null,
      notas: `[${modoEntrega === "envio" ? "ENVÍO" : "TAKE AWAY"}] ${
        comentarios || ""
      }`.trim(),
      costoEnvio,
      total,
      metodoPago,
      aliasPago: metodoPago === "transferencia" ? aliasTransferencia : "",
    };

    const ubicacion =
      modoEntrega === "envio" && coordenadas
        ? `https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}`
        : "Sin ubicación";

    const textoProductos = carrito
      .map(
        (item) =>
          `• ${item.nombre || item.titulo} x${item.cantidad} → $${(
            (Number(item.precio) || 0) * (Number(item.cantidad) || 0)
          ).toLocaleString("es-AR")}`
      )
      .join("\n");

    const mensaje = `Nuevo Pedido ${
      modoEntrega === "envio" ? "🛵 Envío a domicilio" : "🛍️ Take Away"
    }

${textoProductos}

Subtotal: $${subtotal.toLocaleString("es-AR")}
${
  modoEntrega === "envio"
    ? `Envío: $${costoEnvio.toLocaleString("es-AR")}${
        subtotal >= MONTO_ENVIO_GRATIS
          ? ` (GRATIS por compra mayor a $${MONTO_ENVIO_GRATIS.toLocaleString(
              "es-AR"
            )})`
          : ""
      }`
    : "Envío: $0 (take away)"
}
Total final: $${total.toLocaleString("es-AR")}

Modo de entrega: ${
      modoEntrega === "envio"
        ? "Envío a domicilio"
        : "Retira en el local (take away)"
    }
Método de pago: ${metodoPago === "transferencia" ? "Transferencia" : "Efectivo"}
${
  modoEntrega === "envio"
    ? `Dirección: ${direccion}\nUbicación: ${ubicacion}\n`
    : ""
}
Teléfono: ${telefono}
Email: ${email}

Notas:
${comentarios || "Sin notas"}
`;

    const webUrl =
      "https://wa.me/" + ADMIN_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
    const whatsappTab = window.open("", "_blank");

    try {
      const respuesta = await crearPedido(pedido);
      const pedidoCreado = respuesta?.pedido;
      const pedidoId = pedidoCreado?._id;

      if (metodoPago === "transferencia" && pedidoId) {
        if (whatsappTab) {
          whatsappTab.close();
        }
        localStorage.setItem(
          "eldanesPagoPendiente",
          JSON.stringify({
            pedidoId,
            alias: aliasTransferencia,
            total: pedidoCreado.total || total,
            modoEntrega,
            direccion:
              modoEntrega === "envio"
                ? direccion
                : "Retira en el local (take away)",
            telefono,
            comentarios,
            items: carrito.map((item) => ({
              id: item._id || item.id,
              nombre: item.nombre || item.titulo,
              cantidad: Number(item.cantidad) || 0,
              precio: Number(item.precio) || 0,
              imagen: item.imagen || "",
            })),
            creadoEn: new Date().toISOString(),
          })
        );
        navigate(`/pago/${aliasTransferencia}/${pedidoId}`);
        return;
      }

      if (whatsappTab) {
        whatsappTab.location.href = webUrl;
      } else {
        window.location.href = webUrl;
      }

      vaciarCarrito();
      navigate("/tienda");
    } catch (err) {
      if (whatsappTab) whatsappTab.close();
      alert(err.message || "Error al confirmar el pedido");
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#CDC7BD] pt-24 md:pt-16 px-6 pb-10">
      <h1 className="text-3xl font-bold text-center text-[#590707] mb-8 flex gap-2 justify-center">
        <ShoppingCart /> Carrito de Compras
      </h1>

      {pagoPendiente?.pedidoId && carrito.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5 border-2 border-[#590707] max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-bold text-xl text-[#590707]">
              Este pedido ya está guardado
            </p>
            <p className="text-sm text-[#04090C] mt-1">
              Tus productos no se perdieron. Falta realizar la transferencia y enviar el comprobante.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(
                `/pago/${pagoPendiente.alias || "eldanestandil"}/${pagoPendiente.pedidoId}`
              )
            }
            className="shrink-0 bg-[#590707] text-white px-5 py-3 rounded-xl font-bold"
          >
            Continuar con el pago
          </button>
        </div>
      )}

      {/* carrito vacío */}
      {carrito.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-[#e6e2dc] max-w-2xl mx-auto mb-6">
          {pagoPendiente?.pedidoId ? (
            <>
              <p className="font-bold text-xl text-[#590707]">
                Tu pedido ya está guardado
              </p>
              <p className="text-[#04090C] mt-2">
                Falta completar la transferencia y enviar el comprobante.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/pago/${pagoPendiente.alias || "eldanestandil"}/${pagoPendiente.pedidoId}`
                  )
                }
                className="mt-4 bg-[#590707] text-white px-5 py-3 rounded-xl font-bold"
              >
                Continuar con el pago
              </button>
            </>
          ) : (
            <p className="text-[#04090C]">Tu carrito está vacío.</p>
          )}
        </div>
      )}

      {/* LISTA */}
      {carrito.map((item) => {
        const id = item._id || item.id;
        return (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center gap-4 border border-[#e6e2dc]"
          >
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-xl border border-[#d3cdc6]"
              />
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg text-[#04090C] truncate">
                {item.nombre || item.titulo}
              </p>

              <p className="text-sm text-[#736D66]">
                ${Number(item.precio).toLocaleString("es-AR")} c/u
              </p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => cambiarCantidad(id, (item.cantidad || 0) - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-[#A30404] text-white rounded-full hover:bg-[#590707] transition"
                >
                  -
                </button>

                <span className="font-semibold text-lg text-[#04090C]">
                  {item.cantidad}
                </span>

                <button
                  onClick={() => cambiarCantidad(id, (item.cantidad || 0) + 1)}
                  disabled={
                    item.origenCarrito !== "tienda" &&
                    !item.ventaSinControlStock &&
                    Number(item.stock) > 0 &&
                    Number(item.cantidad || 0) >= Number(item.stock)
                  }
                  className="w-8 h-8 flex items-center justify-center bg-[#590707] text-white rounded-full hover:bg-[#A30404] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-[#590707] text-lg">
                $
                {(Number(item.precio) * Number(item.cantidad)).toLocaleString(
                  "es-AR"
                )}
              </p>

              <button
                onClick={() => eliminarItem(id)}
                className="mt-2 text-red-600 hover:text-red-800 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        );
      })}

      {carrito.length > 0 && (
        <>
      {/* RESUMEN */}
      <div className="text-right text-xl font-bold text-[#590707] mb-1">
        Subtotal: ${subtotal.toLocaleString("es-AR")}
      </div>

      <div className="text-right text-xl font-bold text-[#590707] mb-1">
        Envío: ${costoEnvio.toLocaleString("es-AR")}
      </div>

      <div className="text-right text-2xl font-bold text-[#590707] mb-6">
        Total: ${total.toLocaleString("es-AR")}
      </div>
  {/* ✅ NUEVO: INCENTIVO ENVÍO GRATIS */}
      <IncentivoPedido />

      {/* FORMULARIO */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-[#e6e2dc] max-w-3xl mx-auto">
        <p className="font-semibold text-[#04090C] mb-3">Forma de pago</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <button
            type="button"
            aria-pressed={metodoPago === "transferencia"}
            onClick={() => setMetodoPago("transferencia")}
            className={`min-h-[64px] rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${
              metodoPago === "transferencia"
                ? "border-[#590707] bg-[#fff4f2] text-[#590707]"
                : "border-[#d8d2ca] bg-white text-[#04090C]"
            }`}
          >
            <span className="block">Transferencia</span>
            <span className="block text-xs font-normal mt-1">
              Pagá y subí el comprobante
            </span>
          </button>

          <button
            type="button"
            aria-pressed={metodoPago === "efectivo"}
            onClick={() => setMetodoPago("efectivo")}
            className={`min-h-[64px] rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${
              metodoPago === "efectivo"
                ? "border-[#590707] bg-[#fff4f2] text-[#590707]"
                : "border-[#d8d2ca] bg-white text-[#04090C]"
            }`}
          >
            <span className="block">Efectivo</span>
            <span className="block text-xs font-normal mt-1">
              Confirmá el pedido por WhatsApp
            </span>
          </button>
        </div>
        <p className="mb-6 rounded-lg bg-[#f3f0eb] px-3 py-2 text-sm font-semibold text-[#590707]">
          Forma elegida: {metodoPago === "transferencia" ? "Transferencia" : "Efectivo"}
        </p>

        <p className="font-semibold text-[#04090C] mb-2">Modo de entrega</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="modoEntrega"
              value="envio"
              checked={modoEntrega === "envio"}
              onChange={() => setModoEntrega("envio")}
            />
            <span className="text-[#04090C]">Envío a domicilio</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="modoEntrega"
              value="takeaway"
              checked={modoEntrega === "takeaway"}
              onChange={() => setModoEntrega("takeaway")}
            />
            <span className="text-[#04090C]">Take Away</span>
          </label>
        </div>

      {modoEntrega === "envio" && (
  <>
    <label className="font-semibold text-[#04090C]">Dirección *</label>
    <input
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
      className="w-full p-2 border rounded mb-4 text-[#04090C] bg-white"
      placeholder="Ej.: Pasaje Vázquez 123, Tandil"
    />
    {/* MapaEntrega removido */}
  </>
)}

        <label className="font-semibold text-[#04090C]">
          Teléfono (opcional)
        </label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="p-2 border rounded w-full text-[#04090C] bg-white mb-4"
          inputMode="tel"
          placeholder="Con código de área"
        />

        <label className="font-semibold text-[#04090C]">Email (opcional)</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full text-[#04090C] bg-white mb-4"
          placeholder="ej: cliente@gmail.com"
        />

        <label className="font-semibold text-[#04090C] block mt-4">Notas</label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className="p-2 border rounded w-full text-[#04090C] bg-white mt-1"
          placeholder="Indicaciones, timbre, etc."
        />
      </div>



        <div className="flex sm:justify-end max-w-3xl mx-auto">
        <button
          onClick={confirmarYEnviar}
          className="w-full sm:w-auto min-h-[54px] bg-[#590707] text-white py-3 px-5 rounded-xl flex gap-2 justify-center items-center font-bold disabled:opacity-60"
          disabled={!puedeConfirmar}
        >
          <Send />{" "}
          {procesando
            ? "Confirmando..."
            : pagoPendiente?.pedidoId
            ? "Pedido pendiente de pago"
            : metodoPago === "transferencia"
            ? "Confirmar y pagar por transferencia"
            : "Confirmar y enviar por WhatsApp"}
        </button>
      </div>
        </>
      )}
    </div>
  );
}
