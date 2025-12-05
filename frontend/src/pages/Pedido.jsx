import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCarrito } from "../context/CarritoContext";
import { crearPedido } from "../services/api";

import MapaEntrega from "../components/MapaEntrega";
import { ShoppingCart, Trash2, Send } from "lucide-react";

const ADMIN_WHATSAPP = "5492494252530";

export default function Pedido() {
  const navigate = useNavigate();

  // carrito
  const { carrito, guardarCarrito, vaciarCarrito } = useCarrito();

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return eliminarItem(id);
    const actualizado = carrito.map((item) =>
      (item._id || item.id) === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    guardarCarrito(actualizado);
  };

  const eliminarItem = (id) => {
    const nuevo = carrito.filter((item) => (item._id || item.id) !== id);
    guardarCarrito(nuevo);
  };

  // 🔹 modo de entrega primero (SOLUCIONA EL ERROR)
  const [modoEntrega, setModoEntrega] = useState("envio");

  // 🍷 Subtotal sin envío
  const subtotal = carrito.reduce(
    (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
    0
  );

  // 🚚 Costo fijo de envío
  const COSTO_ENVIO = 3000;

  // Si el usuario elige TAKE AWAY → envío = 0
  const costoEnvio = modoEntrega === "envio" ? COSTO_ENVIO : 0;

  // 💰 Total final
  const total = subtotal + costoEnvio;

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [comentarios, setComentarios] = useState("");

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
  const validoTelefono = telSoloDigitos.length >= 10;
  const validoEmail = email.includes("@");

  const requiereDireccion = modoEntrega === "envio";

  const puedeConfirmar =
    carrito.length > 0 &&
    validoTelefono &&
    validoEmail &&
    (!requiereDireccion || validoDireccion);

  const confirmarYEnviar = async () => {
    if (!puedeConfirmar) return;

    const pedido = {
      emailCliente: email,
      items: carrito.map((i) => ({
        bebida: i._id || i.id,
        nombre: i.nombre || i.titulo,
        precio: Number(i.precio) || 0,
        cantidad: Number(i.cantidad) || 0,
      })),
      direccionEntrega:
        modoEntrega === "envio" ? direccion : "Retira en el local (take away)",
      telefono,
      coordenadas: modoEntrega === "envio" ? coordenadas : null,
      notas: `[${modoEntrega === "envio" ? "ENVÍO" : "TAKE AWAY"}] ${
        comentarios || ""
      }`.trim(),
      total, // AHORA INCLUYE ENVÍO
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
    ? `Envío: $${COSTO_ENVIO.toLocaleString("es-AR")}`
    : "Envío: $0 (take away)"
}
Total final: $${total.toLocaleString("es-AR")}

Modo de entrega: ${
      modoEntrega === "envio"
        ? "Envío a domicilio"
        : "Retira en el local (take away)"
    }
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

    try {
      await crearPedido(pedido);

      window.open(
        `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
      );

      vaciarCarrito();
      navigate("/mis-pedidos");
    } catch (err) {
      alert("Error al confirmar el pedido");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#CDC7BD] pt-24 md:pt-16 px-6 pb-10">
      <h1 className="text-3xl font-bold text-center text-[#590707] mb-8 flex gap-2 justify-center">
        <ShoppingCart /> Carrito de Compras
      </h1>

      {/* carrito vacío */}
      {carrito.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-[#e6e2dc] max-w-2xl mx-auto">
          <p className="text-[#04090C]">Tu carrito está vacío.</p>
        </div>
      )}

      {/* LISTA DE PRODUCTOS */}
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
                  className="w-8 h-8 flex items-center justify-center bg-[#590707] text-white rounded-full hover:bg-[#A30404] transition"
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

      {/* RESUMEN FINAL */}
      <div className="text-right text-xl font-bold text-[#590707] mb-1">
        Subtotal: ${subtotal.toLocaleString("es-AR")}
      </div>

      <div className="text-right text-xl font-bold text-[#590707] mb-1">
        Envío: ${costoEnvio.toLocaleString("es-AR")}
      </div>

      <div className="text-right text-2xl font-bold text-[#590707] mb-6">
        Total: ${total.toLocaleString("es-AR")}
      </div>

      {/* FORMULARIO */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-[#e6e2dc] max-w-3xl mx-auto">
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

            <MapaEntrega
              onLocationSelect={setCoordenadas}
              direccion={direccion}
            />
          </>
        )}

        <label className="font-semibold text-[#04090C]">Teléfono *</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="p-2 border rounded w-full text-[#04090C] bg-white mb-4"
          inputMode="tel"
          placeholder="Con código de área"
        />

        <label className="font-semibold text-[#04090C]">Email *</label>
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
          className="bg-[#590707] text-white py-3 px-4 rounded-xl flex gap-2 justify-center items-center disabled:opacity-60"
          disabled={!puedeConfirmar}
        >
          <Send /> Confirmar y enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}
