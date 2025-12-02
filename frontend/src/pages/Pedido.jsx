import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCarrito } from "../context/CarritoContext";
import { crearPedido, obtenerSlotsDisponibles } from "../services/api";
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

  const total = carrito.reduce(
    (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
    0
  );

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [comentarios, setComentarios] = useState("");

  // 🔹 NUEVO: modo de entrega (envío / take away)
  const [modoEntrega, setModoEntrega] = useState("envio"); // "envio" | "takeaway"

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

  const [slots, setSlots] = useState([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarSlots = async () => {
      if (!fecha) {
        setSlots([]);
        setHora("");
        return;
      }

      setCargandoSlots(true);
      try {
        const res = await obtenerSlotsDisponibles(fecha);
        const lista = res?.slots || [];

        if (activo) {
          setSlots(lista);
          if (!lista.some((s) => s.hora === hora && s.disponible !== false)) {
            setHora("");
          }
        }
      } catch {
        if (activo) {
          setSlots([]);
          setHora("");
        }
      } finally {
        if (activo) setCargandoSlots(false);
      }
    };

    cargarSlots();
    return () => (activo = false);
  }, [fecha, hora]);

  const telSoloDigitos = telefono.replace(/\D/g, "");
  const validoDireccion = direccion.trim().length >= 5;
  const validoTelefono = telSoloDigitos.length >= 10;
  const validoEmail = email.includes("@");

  const requiereDireccion = modoEntrega === "envio";

  const puedeConfirmar =
    carrito.length > 0 &&
    validoTelefono &&
    validoEmail &&
    Boolean(fecha) &&
    Boolean(hora) &&
    (!requiereDireccion || validoDireccion);

  const confirmarYEnviar = async () => {
    if (!puedeConfirmar) return;

    const pedido = {
      // usuario: null, // No requiere login
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
      fechaEntrega: fecha,
      horaEntrega: hora,
      // guardamos el modo de entrega dentro de notas
      notas: `[${modoEntrega === "envio" ? "ENVÍO" : "TAKE AWAY"}] ${
        comentarios || ""
      }`.trim(),
      total,
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
    }\n\n${textoProductos}\n\nTotal: $${total.toLocaleString(
      "es-AR"
    )}\n\nModo de entrega: ${
      modoEntrega === "envio"
        ? "Envío a domicilio"
        : "Retira en el local (take away)"
    }\n${
      modoEntrega === "envio"
        ? `Dirección: ${direccion}\nUbicación: ${ubicacion}\n`
        : ""
    }Teléfono: ${telefono}\nEmail: ${email}\nFecha y Hora: ${fecha} ${hora}\n\nNotas\n${
      comentarios || "Sin notas"
    }`;

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

      {carrito.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-6 text-center border border-[#e6e2dc] max-w-2xl mx-auto">
          <p className="text-[#04090C]">Tu carrito está vacío.</p>
        </div>
      )}

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

      <div className="text-right text-2xl font-bold text-[#590707] mb-6">
        Total: ${total.toLocaleString("es-AR")}
      </div>

      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-[#e6e2dc] max-w-3xl mx-auto">
        {/* 🔹 Selector de modo de entrega */}
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
            <span className="text-[#04090C]">
              Take Away (retira en el local)
            </span>
          </label>
        </div>

        {/* Dirección y mapa solo si es envío */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="font-semibold text-[#04090C]">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="p-2 border rounded w-full text-[#04090C] bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-[#04090C]">Hora *</label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="p-2 border rounded w-full text-[#04090C] bg-white"
              disabled={cargandoSlots || slots.length === 0}
            >
              <option value="">
                {cargandoSlots
                  ? "Cargando horarios..."
                  : slots.length
                  ? "Seleccioná hora"
                  : "No hay horarios"}
              </option>

              {slots.map((s, i) => (
                <option
                  key={i}
                  value={s.hora}
                  disabled={s.disponible === false}
                >
                  {s.hora} {s.disponible === false ? "(Ocupado)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

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
