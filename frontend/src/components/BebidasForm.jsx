import React, { useState, useEffect } from "react";

const CATEGORIAS_OFICIALES = [
  "Combos",
  "Cervezas",
  "Vinos",
  "Aperitivos y Licores",
  "Destilados",
  "Gaseosas y jugos",
  "Energizantes",
  "Snacks",
  "Ofertas",
  "Cigarrillos",
];

// Subcategorías oficiales según categoría
const SUBCATEGORIAS = {
  Vinos: ["Tinto", "Blanco", "Rosado"],
  Destilados: ["Vodka", "Gin", "Ron", "Tequila", "Whisky"],
  Whisky: ["Bourbon", "Scotch", "Irish"], // SOLO cuando subcategoria = Whisky
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
    esEstrella: false,
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
        esEstrella: bebidaEditar.esEstrella || false,
      });
    }
  }, [bebidaEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleCategoria = (cat) => {
    setFormData((prev) => {
      const yaEsta = prev.categorias.includes(cat);
      return {
        ...prev,
        categorias: yaEsta
          ? prev.categorias.filter((c) => c !== cat)
          : [...prev.categorias, cat],
      };
    });
  };

  // Categoría principal = primera seleccionada
  const categoriaPrincipal = formData.categorias[0] || "";

  // Subcategorías disponibles según categoría principal
  const subcategoriasDisponibles = SUBCATEGORIAS[categoriaPrincipal] || [];

  // Sub-subcategoría si eligen Whisky
  const tiposWhisky =
    formData.subcategoria === "Whisky" ? SUBCATEGORIAS.Whisky : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Siempre guardamos categorías como array
    const dataEnviar = {
      ...formData,
      categorias: formData.categorias,
      subcategoria: formData.subcategoria || "",
    };

    onSubmit(dataEnviar);

    if (!bebidaEditar) {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen: "",
        categorias: [],
        subcategoria: "",
        esEstrella: false,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="font-semibold text-[#04090C]">Nombre</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="font-semibold text-[#04090C]">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="font-semibold text-[#04090C]">Precio</label>
        <input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="font-semibold text-[#04090C]">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* Imagen */}
      <div>
        <label className="font-semibold text-[#04090C]">Imagen (URL)</label>
        <input
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* CATEGORÍAS */}
      <div>
        <label className="font-semibold text-[#04090C]">Categorías</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {CATEGORIAS_OFICIALES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => toggleCategoria(cat)}
              className={`px-3 py-2 rounded border text-sm ${
                formData.categorias.includes(cat)
                  ? "bg-[#590707] text-white border-[#590707]"
                  : "bg-white border-[#CDC7BD]"
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
          <label className="font-semibold text-[#04090C]">Subcategoría</label>

          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white mt-1"
          >
            <option value="">Seleccionar...</option>
            {subcategoriasDisponibles.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TIPOS DE WHISKY */}
      {tiposWhisky.length > 0 && (
        <div>
          <label className="font-semibold text-[#04090C]">Tipo de Whisky</label>

          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white mt-1"
          >
            {tiposWhisky.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ESTRELLA */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="esEstrella"
          checked={formData.esEstrella}
          onChange={handleChange}
        />
        <span className="font-semibold text-[#04090C]">
          Producto destacado ⭐
        </span>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-[#590707] text-white px-4 py-2 rounded"
        >
          Guardar
        </button>

        {bebidaEditar && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
