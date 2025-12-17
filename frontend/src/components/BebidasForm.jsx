import React, { useState, useEffect } from "react";

const CATEGORIAS_OFICIALES = [
  "Combos",
  "Cervezas",
  "Vinos",
  "Espumantes", // ✅ NUEVA
  "Aperitivos y Licores",
  "Destilados",
  "Gaseosas y jugos",
  "Energizantes",
  "Snacks",
  "Extras y hielo", // ✅ NUEVA
  "Ofertas",
  "Cigarrillos",
];

// Subcategorías oficiales según categoría
const SUBCATEGORIAS = {
  Vinos: ["Tinto", "Blanco", "Rosado"],
  Destilados: ["Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  Whisky: ["Bourbon", "Scotch", "Irish"],
};

export default function BebidasForm({ onSubmit, bebidaEditar, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categorias: [],
    subcategoria: "",
    tipoWhisky: "",
    esEstrella: false,
    orden: "",
  });

  // Cargar datos cuando editan
  useEffect(() => {
    if (bebidaEditar) {
      setFormData({
        nombre: bebidaEditar.nombre || "",
        descripcion: bebidaEditar.descripcion || "",
        precio: bebidaEditar.precio || "",
        stock: bebidaEditar.stock || "",
        imagen: bebidaEditar.imagen || "",
        categorias: bebidaEditar.categorias || [],
        subcategoria: bebidaEditar.subcategoria || "",
        tipoWhisky: bebidaEditar.tipoWhisky || "",
        esEstrella: bebidaEditar.esEstrella || false,
        orden: bebidaEditar.orden || "",
      });
    }
  }, [bebidaEditar]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Selección/deselección de categoría
  const toggleCategoria = (cat) => {
    console.log("✅ toggleCategoria llamado con:", cat); // ← AGREGAR ESTA LÍNEA
    setFormData((prev) => {
      const yaEsta = prev.categorias.includes(cat);

      let nuevasCats = yaEsta
        ? prev.categorias.filter((c) => c !== cat)
        : [...prev.categorias, cat];

      // Si cambió la categoría principal → reset subcategorías
      const categoriaPrincipalNueva = nuevasCats[0] || "";

      if (categoriaPrincipalNueva !== prev.categorias[0]) {
        return {
          ...prev,
          categorias: nuevasCats,
          subcategoria: "",
          tipoWhisky: "",
        };
      }

      return { ...prev, categorias: nuevasCats };
    });
  };

  /* =========================================================
     DERIVADOS
  ========================================================= */

  const categoriaPrincipal = formData.categorias[0] || "";

  const subcategoriasDisponibles = SUBCATEGORIAS[categoriaPrincipal] || [];

  const tiposWhisky =
    formData.subcategoria === "Whisky" ? SUBCATEGORIAS.Whisky : [];

  /* =========================================================
   SUBMIT
========================================================= */

const handleSubmit = (e) => {
  e.preventDefault();

  const dataEnviar = {
    ...formData,
    categorias: formData.categorias,
    subcategoria: formData.subcategoria || "",
    tipoWhisky: formData.tipoWhisky || "",
    orden: formData.orden ? Number(formData.orden) : null,
  };

  onSubmit(dataEnviar);

  // ✅ LIMPIAR FORMULARIO SIEMPRE (tanto al crear como al editar)
  setFormData({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categorias: [],
    subcategoria: "",
    tipoWhisky: "",
    esEstrella: false,
    orden: "",
  });
};
  

  /* =========================================================
     UI
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[#F2ECE4] p-6 rounded-lg mx-auto max-w-2xl w-full md:max-w-3xl"
    >
      {/* NOMBRE */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Nombre
        </label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400"
          placeholder="Ej: Malbec Classico"
          required
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400 min-h-24"
          placeholder="Describe el producto..."
        />
      </div>

      {/* PRECIO */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Precio
        </label>
        <input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400"
          placeholder="0.00"
          required
        />
      </div>

      {/* STOCK */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400"
          placeholder="0"
        />
      </div>

      {/* ✅ ORDEN DE VISUALIZACIÓN */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Orden de Visualización
          <span className="text-xs text-[#736D66] ml-2 block mt-1">
            (Números del 1-10 se muestran primero. Dejar vacío para orden
            normal)
          </span>
        </label>
        <input
          name="orden"
          type="number"
          min="1"
          max="10"
          value={formData.orden}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400"
          placeholder="Ej: 1, 2, 3... (opcional)"
        />
      </div>

      {/* IMAGEN */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Imagen (URL)
        </label>
        <input
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] placeholder-gray-400"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      {/* CATEGORÍAS */}
      <div>
        <label className="font-semibold text-[#590707] block mb-2">
          Categorías
        </label>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {CATEGORIAS_OFICIALES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => toggleCategoria(cat)}
              className={`px-3 py-2 rounded border text-sm font-medium transition ${
                formData.categorias.includes(cat)
                  ? "bg-[#590707] text-white border-[#590707]"
                  : "bg-white border-[#CDC7BD] text-[#04090C] hover:bg-[#F2ECE4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUBCATEGORÍAS */}
      {subcategoriasDisponibles.length > 0 && (
        <div>
          <label className="font-semibold text-[#590707] block mb-2">
            Subcategoría
          </label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={(e) =>
              setFormData({
                ...formData,
                subcategoria: e.target.value,
                tipoWhisky: "",
              })
            }
            className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] mt-1 font-medium"
          >
            <option value="">Seleccionar…</option>
            {subcategoriasDisponibles.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TIPO DE WHISKY */}
      {tiposWhisky.length > 0 && (
        <div>
          <label className="font-semibold text-[#590707] block mb-2">
            Tipo de Whisky
          </label>
          <select
            name="tipoWhisky"
            value={formData.tipoWhisky}
            onChange={handleChange}
            className="w-full p-2 border border-[#CDC7BD] rounded bg-white text-[#04090C] mt-1 font-medium"
          >
            <option value="">Seleccionar…</option>
            {tiposWhisky.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ESTRELLA */}
      <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#CDC7BD]">
        <input
          type="checkbox"
          name="esEstrella"
          checked={formData.esEstrella}
          onChange={handleChange}
          className="w-4 h-4 cursor-pointer"
        />
        <span className="font-semibold text-[#590707] cursor-pointer">
          Producto destacado ⭐
        </span>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-[#590707] text-white px-6 py-2 rounded font-semibold hover:bg-[#A30404] transition"
        >
          Guardar
        </button>

        {bebidaEditar && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#CDC7BD] text-[#04090C] px-6 py-2 rounded font-semibold hover:bg-[#a89f95] transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
