import React, { useState, useEffect } from "react";

const BebidasForm = ({ onSubmit, bebidaEditar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categorias: [], // ✅ Array para múltiples categorías
    subcategoria: "", // ✅ Para vinos: Blanco, Rosé, Tinto
    esEstrella: false, // ✅ Producto destacado
  });

  // ✅ CATEGORÍAS DISPONIBLES
  const categoriasDisponibles = [
    "Vinos",
    "Cervezas",
    "Gaseosas",
    "Jugos",
    "Espumantes",
    "Whisky",
    "Blancas",
    "Licores",
    "Aperitivos",
    "Energéticas",
    "Aguas",
    "Combos", // ✅ NUEVA
    "Mayoristas",
    "Ofertas",
    "Regalos",
    "Gift Cards",
    "Wine Club",
    "Experiencias",
  ];

  // ✅ SUBCATEGORÍAS DE VINOS
  const subcategoriasVinos = ["Tinto", "Blanco", "Rosé"];

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

  // ✅ MANEJO DE CATEGORÍAS MÚLTIPLES
  const handleCategoriaToggle = (categoria) => {
    setFormData((prev) => {
      const nuevasCategorias = prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria];

      return { ...prev, categorias: nuevasCategorias };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

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

  // ✅ Verifica si "Vinos" está seleccionado
  const esVinoSeleccionado = formData.categorias.includes("Vinos");

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-[#04090C] shadow-xl rounded-xl px-8 pt-6 pb-8 mb-6 border border-[#CDC7BD]"
    >
      <h2 className="text-2xl font-bold mb-6 border-b border-[#CDC7BD] pb-3">
        {bebidaEditar ? "Editar Bebida" : "Agregar Bebida"}
      </h2>

      {/* Nombre */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Nombre *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 focus:ring-[#A30404] outline-none"
          placeholder="Malbec Reserva 2019"
        />
      </div>

      {/* Descripción */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 focus:ring-[#A30404] outline-none"
          placeholder="Notas de cata..."
        />
      </div>

      {/* ✅ CATEGORÍAS MÚLTIPLES */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-3">
          Categorías * (Selección múltiple)
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
        {formData.categorias.length > 0 && (
          <p className="text-xs text-[#736D66] mt-2">
            Seleccionadas: {formData.categorias.join(", ")}
          </p>
        )}
      </div>

      {/* ✅ SUBCATEGORÍA DE VINOS (solo si "Vinos" está seleccionado) */}
      {esVinoSeleccionado && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Tipo de Vino
          </label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 focus:ring-[#A30404] outline-none"
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

      {/* ✅ PRODUCTO ESTRELLA */}
      <div className="mb-5 bg-[#FFF9E6] border-2 border-[#FFD700] rounded-lg p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="esEstrella"
            checked={formData.esEstrella}
            onChange={handleChange}
            className="w-5 h-5 accent-[#FFD700]"
          />
          <span className="text-sm font-semibold text-[#04090C]">
            ⭐ Destacar como Producto Estrella
          </span>
        </label>
        <p className="text-xs text-[#736D66] mt-2">
          Los productos destacados aparecen en la sección principal antes del
          catálogo
        </p>
      </div>

      {/* Precio & Stock */}
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
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C]"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C]"
            placeholder="0"
          />
        </div>
      </div>

      {/* Imagen */}
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
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C]"
        />
        {formData.imagen && (
          <img
            src={formData.imagen}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-[#CDC7BD] mt-3 mx-auto"
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-[#590707] hover:bg-[#A30404] text-white font-bold py-3 px-6 rounded-lg w-full shadow-lg transition"
      >
        {bebidaEditar ? "✓ Actualizar Bebida" : "+ Agregar Bebida"}
      </button>
    </form>
  );
};

export default BebidasForm;
