import React, { useState, useEffect } from "react";

const BebidasForm = ({ onSubmit, bebidaEditar, onCancel }) => {
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

  // ============================
  // ✔ CATEGORÍAS NUEVAS DEL CLIENTE
  // ============================
  const categoriasDisponibles = [
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

  // SUBCATEGORÍAS DE VINOS
  const subcategoriasVinos = ["Tinto", "Blanco", "Rosé"];

  // SUBCATEGORÍAS DE DESTILADOS (primer nivel)
  const subDestilados = ["Vodka", "Gin", "Ron", "Tequila", "Whisky"];

  // SUB-SUBCATEGORÍAS SOLO PARA "Whisky"
  const subWhisky = ["Bourbon", "Scotch", "Irish"];

  useEffect(() => {
    if (bebidaEditar) {
      setFormData({
        nombre: bebidaEditar.nombre || "",
        descripcion: bebidaEditar.descripcion || "",
        precio: bebidaEditar.precio || "",
        stock: bebidaEditar.stock || "",
        imagen: bebidaEditar.imagen || "",
        categorias:
          (Array.isArray(bebidaEditar.categorias) &&
            bebidaEditar.categorias.length > 0 &&
            bebidaEditar.categorias) ||
          (bebidaEditar.categoria ? [bebidaEditar.categoria] : []),

        subcategoria: bebidaEditar.subcategoria || "",
        esEstrella: bebidaEditar.esEstrella || false,
      });
    } else {
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
  }, [bebidaEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCategoriaToggle = (categoria) => {
    setFormData((prev) => {
      const nuevas = prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria];

      return {
        ...prev,
        categorias: nuevas,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoriaPrincipal =
      Array.isArray(formData.categorias) && formData.categorias.length > 0
        ? formData.categorias[0]
        : "";

    const payload = {
      ...formData,
      categoria: categoriaPrincipal,
    };

    onSubmit(payload);

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

  const handleCancel = () => {
    if (bebidaEditar && onCancel) onCancel();

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
  };

  // ============================
  // LOGICA DE SUBCATEGORÍAS
  // ============================

  const esVinoSeleccionado = formData.categorias.includes("Vinos");
  const esDestiladoSeleccionado = formData.categorias.includes("Destilados");

  const subcategoriaEsWhisky = formData.subcategoria === "Whisky";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-[#04090C] shadow-xl rounded-xl px-8 pt-6 pb-8 mb-6 border border-[#CDC7BD]"
    >
      <h2 className="text-2xl font-bold mb-6 border-b border-[#CDC7BD] pb-3">
        {bebidaEditar ? "Editar Bebida" : "Agregar Bebida"}
      </h2>

      {/* NOMBRE */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          placeholder="Ej: Malbec Reserva 2019"
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          placeholder="Notas de cata..."
        />
      </div>

      {/* CATEGORÍAS */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-3">
          Categorías * (selección múltiple)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-[#CDC7BD] rounded-lg p-4 bg-[#F7F5F2]">
          {categoriasDisponibles.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={formData.categorias.includes(cat)}
                onChange={() => handleCategoriaToggle(cat)}
                className="w-4 h-4 accent-[#590707]"
              />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SUBCATEGORÍAS VINOS */}
      {esVinoSeleccionado && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Tipo de Vino
          </label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          >
            <option value="">Seleccionar tipo</option>
            {subcategoriasVinos.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SUBCATEGORÍAS DESTILADOS */}
      {esDestiladoSeleccionado && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Tipo de Destilado
          </label>

          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          >
            <option value="">Seleccionar tipo</option>

            {subDestilados.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* SUB-SUBCATEGORÍAS WHISKY */}
      {esDestiladoSeleccionado && subcategoriaEsWhisky && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Tipo de Whisky
          </label>

          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          >
            <option value="">Seleccionar tipo</option>

            {subWhisky.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PRODUCTO ESTRELLA */}
      <div className="mb-5 bg-[#FFF9E6] border-2 border-[#FFD700] rounded-lg p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="esEstrella"
            checked={formData.esEstrella}
            onChange={handleChange}
            className="w-5 h-5 accent-[#FFD700]"
          />
          <span className="text-sm font-semibold">⭐ Producto Estrella</span>
        </label>
        <p className="text-xs text-[#736D66] mt-2">
          Aparece en la sección destacada del catálogo
        </p>
      </div>

      {/* PRECIO Y STOCK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Precio *</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            step="0.01"
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
          />
        </div>
      </div>

      {/* IMAGEN */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">
          URL de la Imagen
        </label>
        <input
          type="text"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="https://ejemplo.com/botella.jpg"
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4"
        />

        {formData.imagen && (
          <img
            src={formData.imagen}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-[#CDC7BD] mt-3 mx-auto"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/128x128/CDC7BD/04090C?text=Sin+Img")
            }
          />
        )}
      </div>

      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-3 justify-end mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="border border-[#CDC7BD] text-[#04090C] font-semibold py-3 px-5 rounded-lg bg-white hover:bg-[#F2ECE4] transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="bg-[#590707] hover:bg-[#A30404] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
        >
          {bebidaEditar ? "✓ Actualizar Bebida" : "+ Agregar Bebida"}
        </button>
      </div>
    </form>
  );
};

export default BebidasForm;
