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
  Whisky: ["Bourbon", "Scotch", "Irish"], // SOLO si subcategoria = Whisky
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
    tipoWhisky: "", // 🟢 agregado
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
        tipoWhisky: bebidaEditar.tipoWhisky || "",
        esEstrella: bebidaEditar.esEstrella || false,
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
    setFormData((prev) => {
      const yaEsta = prev.categorias.includes(cat);

      let nuevasCats = yaEsta
        ? prev.categorias.filter((c) => c !== cat)
        : [...prev.categorias, cat];

      // 🟡 Si cambió la categoría principal → reset subcategorías
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
        tipoWhisky: "",
        esEstrella: false,
      });
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* NOMBRE */}
      <div>
        <label className="font-semibold">Nombre</label>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
          required
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <label className="font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* PRECIO */}
      <div>
        <label className="font-semibold">Precio</label>
        <input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
          required
        />
      </div>

      {/* STOCK */}
      <div>
        <label className="font-semibold">Stock</label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* IMAGEN */}
      <div>
        <label className="font-semibold">Imagen (URL)</label>
        <input
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* CATEGORÍAS */}
      <div>
        <label className="font-semibold">Categorías</label>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {CATEGORIAS_OFICIALES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => toggleCategoria(cat)}
              className={`px-3 py-2 rounded border text-sm ${
                formData.categorias.includes(cat)
                  ? "bg-[#590707] text-white"
                  : "bg-white border-gray-300"
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
          <label className="font-semibold">Subcategoría</label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={(e) =>
              setFormData({
                ...formData,
                subcategoria: e.target.value,
                tipoWhisky: "", // Reset
              })
            }
            className="w-full p-2 border rounded bg-white mt-1"
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
          <label className="font-semibold">Tipo de Whisky</label>
          <select
            name="tipoWhisky"
            value={formData.tipoWhisky}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-white mt-1"
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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="esEstrella"
          checked={formData.esEstrella}
          onChange={handleChange}
        />
        <span className="font-semibold">Producto destacado ⭐</span>
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
