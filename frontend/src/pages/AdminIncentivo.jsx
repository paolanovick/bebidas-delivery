import React, { useState, useEffect } from "react";
import { getConfigIncentivo, updateConfigIncentivo, getBebidas } from "../services/api";

export default function AdminIncentivo() {
  const [config, setConfig] = useState({
    textoIncentivo: "",
    montoMinimoEnvioGratis: 40000,
    categoriasProductosSugeridos: [],
  });

  const [bebidas, setBebidas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const categoriasPosibles = [
  "Combos",
  "Cervezas",
  "Vinos",
  "Espumantes",
  "Aperitivos y Licores",
  "Destilados",
  "Gaseosas y jugos",
  "Energizantes",
  "Snacks",
  "Extras y hielo",
  "Ofertas",
  "Cigarrillos",
];

  useEffect(() => {
    const cargar = async () => {
      try {
        const [dataConfig, dataBebidas] = await Promise.all([
          getConfigIncentivo(),
          getBebidas()
        ]);

        setConfig(dataConfig);
        setBebidas(dataBebidas);
      } catch (error) {
        console.error("Error al cargar:", error);
        // Si no hay config, usar valores default
        setConfig({
          textoIncentivo: "¡Estás cerca del envío gratis!",
          montoMinimoEnvioGratis: 40000,
          categoriasProductosSugeridos: ["Snacks", "Gaseosas y jugos", "Extras y hielo"],
        });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleCategoriaToggle = (categoria) => {
    setConfig((prev) => ({
      ...prev,
      categoriasProductosSugeridos: prev.categoriasProductosSugeridos.includes(categoria)
        ? prev.categoriasProductosSugeridos.filter((c) => c !== categoria)
        : [...prev.categoriasProductosSugeridos, categoria],
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await updateConfigIncentivo(config);
      setMensaje("✅ Configuración actualizada correctamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al actualizar configuración");
    } finally {
      setLoading(false);
    }
  };

  // Productos que serían sugeridos con la config actual
  const productosSugeridosPreview = bebidas
    .filter((b) => {
      const cats = Array.isArray(b.categorias) ? b.categorias : [b.categoria];
      return cats.some((cat) => config.categoriasProductosSugeridos.includes(cat));
    })
    .slice(0, 6);

  if (loading && bebidas.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl">
        <p className="text-center text-[#736D66]">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-[#04090C] border-b border-[#CDC7BD] pb-3">
        🎯 Configuración de Incentivo de Pedido
      </h2>

      {mensaje && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            mensaje.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-6">
        {/* TEXTO DEL INCENTIVO */}
        <div>
          <label className="block text-[#04090C] font-semibold mb-2">
            📝 Texto del Incentivo:
          </label>
          <input
            type="text"
            value={config.textoIncentivo}
            onChange={(e) =>
              setConfig({ ...config, textoIncentivo: e.target.value })
            }
            placeholder="Ej: ¡Estás cerca del envío gratis!"
            className="w-full p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C]"
          />
          <p className="text-sm text-[#736D66] mt-2">
            Este texto se mostrará en el componente de incentivo
          </p>
        </div>

        {/* MONTO MÍNIMO */}
        <div>
          <label className="block text-[#04090C] font-semibold mb-2">
            💵 Monto Mínimo para Envío Gratis ($):
          </label>
          <input
            type="number"
            value={config.montoMinimoEnvioGratis}
            onChange={(e) =>
              setConfig({
                ...config,
                montoMinimoEnvioGratis: parseFloat(e.target.value) || 0,
              })
            }
            step="100"
            min="0"
            className="w-full p-3 border-2 border-[#CDC7BD] rounded-lg bg-white text-[#04090C] font-semibold text-lg"
          />
          <p className="text-sm text-[#736D66] mt-2">
            Cuando el subtotal llegue a este monto, se mostrará mensaje de envío gratis
          </p>
        </div>

        {/* CATEGORÍAS SUGERIDAS */}
        <div>
          <label className="block text-[#04090C] font-semibold mb-3">
            🏷️ Categorías para Productos Sugeridos:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoriasPosibles.map((categoria) => (
              <button
                key={categoria}
                type="button"
                onClick={() => handleCategoriaToggle(categoria)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  config.categoriasProductosSugeridos.includes(categoria)
                    ? "bg-[#590707] text-white shadow-md"
                    : "bg-[#CDC7BD] text-[#04090C] hover:bg-[#736D66] hover:text-white"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
          <p className="text-sm text-[#736D66] mt-2">
            Los productos de estas categorías se sugerirán para completar el pedido
          </p>
        </div>

        {/* VISTA PREVIA */}
        <div className="border-t-2 border-[#CDC7BD] pt-6">
          <h3 className="text-lg font-bold text-[#590707] mb-4">
            👀 Vista Previa de Productos Sugeridos
          </h3>
          {productosSugeridosPreview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productosSugeridosPreview.map((producto) => (
                <div
                  key={producto._id}
                  className="bg-[#F2ECE4] rounded-xl p-3 border border-[#CDC7BD]"
                >
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h5 className="font-semibold text-[#04090C] text-xs mb-1 line-clamp-2">
                    {producto.nombre}
                  </h5>
                  <p className="text-sm font-bold text-[#590707]">
                    ${Number(producto.precio).toLocaleString("es-AR")}
                  </p>
                  <p className="text-xs text-[#736D66] mt-1">
                    {Array.isArray(producto.categorias)
                      ? producto.categorias[0]
                      : producto.categoria}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-[#F2ECE4] rounded-lg">
              <p className="text-[#736D66]">
                No hay productos en las categorías seleccionadas
              </p>
            </div>
          )}
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#590707] hover:bg-[#A30404] text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-[#736D66] shadow-lg"
        >
          {loading ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </form>

      {/* INFO */}
      <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="font-bold text-[#590707] mb-2 text-lg">
          💡 ¿Cómo funciona?
        </h3>
        <ul className="text-sm text-[#736D66] space-y-1">
          <li>✓ El componente IncentivoPedido usará estos valores</li>
          <li>✓ Se sugieren productos inteligentes según categorías</li>
          <li>✓ Prioriza productos que completen el monto faltante</li>
          <li>✓ No sugiere productos ya en el carrito</li>
        </ul>
      </div>
    </div>
  );
}