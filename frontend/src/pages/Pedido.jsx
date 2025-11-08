import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext"; // ⬅️ IMPORTANTE
import { crearPedido, obtenerSlotsDisponibles } from "../services/api";
import MapaEntrega from "../components/MapaEntrega";
import { ShoppingCart, Trash2, Send } from "lucide-react";

/**
 * Pedido.jsx — Página de pedidos para negocio de bebidas
 *
 * - Usa CarritoContext para sincronizar numerito del navbar
 * - Inputs con texto negro
 * - Mapa: el componente MapaEntrega geocodifica en Tandil cuando cambia 'direccion'
 * - Un solo botón: guarda en backend + abre WhatsApp + vacía carrito + redirige
 */

const ADMIN_WHATSAPP = "5491151215750";

export default function Pedido() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // ===================== Carrito (Contexto Global) =====================
  const { carrito, guardarCarrito } = useCarrito();

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return eliminarItem(id);
    const actualizado = carrito.map((item) =>
      (item._id || item.id) === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    guardarCarrito(actualizado); // ⬅️ actualiza numerito del navbar en vivo
  };

  const eliminarItem = (id) => {
    const nuevo = carrito.filter((item) => (item._id || item.id) !== id);
    guardarCarrito(nuevo); // ⬅️ actualiza numerito del navbar en vivo
  };

  const total = carrito.reduce(
    (sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
    0
  );

  // ===================== Datos de entrega =====================
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [coordenadas, setCoordenadas] = useState(null); // { lat, lng }
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [comentarios, setComentarios] = useState("");

  // Geolocalización inicial (si el usuario acepta)
  useEffect(() => {
    if (!coordenadas && "geolocation" in navigator) {
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
  }, [coordenadas]);

  // ===================== Slots por fecha =====================
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
          // Si la hora ya no está disponible → limpiar
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
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]); // 👈 mantenemos SOLO fecha
  // 👈 SOLO depende de la fecha

  // ===================== Validaciones =====================
  const telSoloDigitos = telefono.replace(/\D/g, "");
  const validoDireccion = direccion.trim().length >= 5;
  const validoTelefono = telSoloDigitos.length >= 10; // AR
  const validoFecha = Boolean(fecha);
  const validoHora = Boolean(hora);

  const puedeConfirmar =
    carrito.length > 0 &&
    validoDireccion &&
    validoTelefono &&
    validoFecha &&
    validoHora;

  // ===================== Un solo botón: guardar + WhatsApp =====================
  const confirmarYEnviar = async () => {
    if (!usuario) return navigate("/login");
    if (!puedeConfirmar) return;

    const pedido = {
      usuarioId: usuario.id || usuario._id,
      items: carrito.map((i) => ({
        bebida: i._id || i.id,
        nombre: i.nombre || i.titulo,
        precio: Number(i.precio) || 0,
        cantidad: Number(i.cantidad) || 0,
      })),
      direccionEntrega: direccion,
      telefono,
      coordenadas,
      fechaEntrega: fecha,
      horaEntrega: hora,
      notas: comentarios,
      total,
    };

    // mensaje de WhatsApp
    const ubicacion = coordenadas
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

    const mensaje = `Nuevo Pedido 🛵\n\n${textoProductos}\n\nTotal: $${total.toLocaleString(
      "es-AR"
    )}\n\nDirección: ${direccion}\nTeléfono: ${telefono}\nFecha y Hora: ${fecha} ${hora}\n\nLink a ubicación\n${ubicacion}\n\nNotas\n${
      comentarios || "Sin notas"
    }`;

    try {
      // 1) Guardar en backend
      await crearPedido(pedido);

      // 2) Abrir WhatsApp
      window.open(
        `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
      );

      // 3) Vaciar carrito (impacta numerito del navbar)
      guardarCarrito([]);

      // 4) Navegar a mis pedidos
      navigate("/mis-pedidos");
    } catch (err) {
      alert("Error al confirmar el pedido");
      console.error(err);
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen bg-[#CDC7BD] py-10 px-6">
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
            {/* Imagen */}
            {item.imagen && (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-xl border border-[#d3cdc6]"
              />
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg text-[#04090C] truncate">
                {item.nombre || item.titulo}
              </p>
              <p className="text-sm text-[#736D66]">
                ${Number(item.precio).toLocaleString("es-AR")} c/u
              </p>

              {/* Botones cantidad */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => cambiarCantidad(id, (item.cantidad || 0) - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-[#A30404] text-white rounded-full hover:bg-[#590707] transition"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>

                <span className="font-semibold text-lg text-[#04090C]">
                  {item.cantidad}
                </span>

                <button
                  onClick={() => cambiarCantidad(id, (item.cantidad || 0) + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-[#590707] text-white rounded-full hover:bg-[#A30404] transition"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Precio Final + Eliminar */}
            <div className="text-right">
              <p className="font-bold text-[#590707] text-lg">
                $
                {(Number(item.precio) * Number(item.cantidad)).toLocaleString(
                  "es-AR",
                  { minimumFractionDigits: 0 }
                )}
              </p>

              <button
                onClick={() => eliminarItem(id)}
                className="mt-2 text-red-600 hover:text-red-800 transition"
                aria-label={`Eliminar ${item.nombre}`}
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

      {/* Datos de entrega */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-[#e6e2dc] max-w-3xl mx-auto">
        <label className="font-semibold text-[#04090C]">
          Dirección <span className="text-red-600">*</span>
        </label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className={`w-full p-2 border rounded mb-4 text-[#04090C] bg-white ${
            direccion && !validoDireccion ? "border-red-500" : ""
          }`}
          placeholder="Ej.: Pasaje Vázquez 123, Tandil"
        />

        <label className="font-semibold text-[#04090C]">
          Teléfono <span className="text-red-600">*</span>
        </label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={`p-2 border rounded w-full text-[#04090C] bg-white mb-4 ${
            telefono && !validoTelefono ? "border-red-500" : ""
          }`}
          inputMode="tel"
          placeholder="Con código de área"
        />

        {/* El mapa se centra al escribir dirección (Tandil por defecto) */}
        <MapaEntrega onLocationSelect={setCoordenadas} direccion={direccion} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="font-semibold text-[#04090C]">
              Fecha <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="p-2 border rounded w-full text-[#04090C] bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-[#04090C]">
              Hora <span className="text-red-600">*</span>
            </label>
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

      {/* Un solo botón */}
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
