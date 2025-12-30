import React, { useMemo } from "react";
import { useBebidas } from "../context/BebidasContext";
import { useCarrito } from "../context/CarritoContext";

const ENVIO_GRATIS_MINIMO = 40000;

export default function IncentivoPedido() {
  const { bebidas } = useBebidas();
  const { carrito, agregar } = useCarrito();

  // Calcular subtotal
  const subtotal = carrito.reduce(
    (sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
    0
  );

  // Cuánto falta para envío gratis
  const falta = ENVIO_GRATIS_MINIMO - subtotal;
  const porcentaje = Math.min((subtotal / ENVIO_GRATIS_MINIMO) * 100, 100);
  const yaLogroEnvioGratis = subtotal >= ENVIO_GRATIS_MINIMO;

  // Productos sugeridos inteligentes
  const productosSugeridos = useMemo(() => {
    if (yaLogroEnvioGratis) return [];

    // IDs de productos ya en el carrito
    const idsEnCarrito = carrito.map(item => item._id || item.id);

    // Filtrar productos disponibles (con stock y no en carrito)
    const disponibles = bebidas.filter(
      b => b.stock > 0 && !idsEnCarrito.includes(b._id || b.id)
    );

    // Productos que completan el monto (entre 30% y 70% de lo que falta)
    const rangoMin = falta * 0.3;
    const rangoMax = falta * 0.7;

    let candidatos = disponibles.filter(
      b => Number(b.precio) >= rangoMin && Number(b.precio) <= rangoMax
    );

    // Si no hay en ese rango, buscar los más cercanos
    if (candidatos.length === 0) {
      candidatos = disponibles
        .sort((a, b) => Math.abs(Number(a.precio) - falta / 2) - Math.abs(Number(b.precio) - falta / 2))
        .slice(0, 3);
    }

    // Priorizar snacks, gaseosas, hielo (productos complementarios)
    const complementarios = candidatos.filter(b => {
      const cats = Array.isArray(b.categorias) ? b.categorias : [b.categoria];
      return cats.some(cat => 
        ['Snacks', 'Gaseosas y jugos', 'Extras y hielo', 'Energizantes'].includes(cat)
      );
    });

    const resultado = complementarios.length > 0 ? complementarios : candidatos;
    
    return resultado.slice(0, 3);
  }, [bebidas, carrito, falta, yaLogroEnvioGratis]);

  // No mostrar nada si el carrito está vacío
  if (carrito.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-[#590707] max-w-3xl mx-auto">
      {/* TÍTULO Y BARRA */}
      <div className="mb-4">
        {yaLogroEnvioGratis ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎉</span>
              <h3 className="text-xl font-bold text-green-600">
                ¡Felicitaciones! Tenés envío gratis
              </h3>
            </div>
            {/* Barra completa */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: '100%' }}
              >
                <span className="text-xs text-white font-bold">100%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              ${subtotal.toLocaleString('es-AR')} / ${ENVIO_GRATIS_MINIMO.toLocaleString('es-AR')}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚚</span>
              <h3 className="text-xl font-bold text-[#590707]">
                ¡Estás cerca del envío gratis!
              </h3>
            </div>
            <p className="text-lg text-[#04090C] mb-3">
              Te faltan <span className="font-bold text-[#590707]">${falta.toLocaleString('es-AR')}</span>
            </p>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#A30404] to-[#590707] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${porcentaje}%` }}
              >
                {porcentaje > 15 && (
                  <span className="text-xs text-white font-bold">{Math.round(porcentaje)}%</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              ${subtotal.toLocaleString('es-AR')} / ${ENVIO_GRATIS_MINIMO.toLocaleString('es-AR')}
            </p>
          </>
        )}
      </div>

      {/* PRODUCTOS SUGERIDOS */}
      {!yaLogroEnvioGratis && productosSugeridos.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💡</span>
            <h4 className="text-lg font-semibold text-[#04090C]">
              Agregá estos productos:
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {productosSugeridos.map((producto) => (
              <div 
                key={producto._id || producto.id}
                className="bg-[#F2ECE4] rounded-xl p-4 border border-[#CDC7BD] hover:shadow-md transition-shadow"
              >
                {producto.imagen && (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                )}
                <h5 className="font-semibold text-[#04090C] text-sm mb-2 line-clamp-2">
                  {producto.nombre}
                </h5>
                <p className="text-lg font-bold text-[#590707] mb-3">
                  ${Number(producto.precio).toLocaleString('es-AR')}
                </p>
                <button
                  onClick={() => agregar(producto)}
                  className="w-full bg-[#590707] hover:bg-[#A30404] text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}