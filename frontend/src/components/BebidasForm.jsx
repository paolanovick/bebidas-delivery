import React, { useState, useEffect } from "react";

const BebidasForm = ({ onSubmit, bebidaEditar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categorias: [], // Array para múltiples categorías
    subcategoria: "", // Para vinos: Blanco, Rosé, Tinto
    esEstrella: false, // Producto destacado
  });

  const [errores, setErrores] = useState({});

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
    "Combos",
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
        precio:
          bebidaEditar.precio !== undefined && bebidaEditar.precio !== null
            ? String(bebidaEditar.precio)
            : "",
        stock:
          bebidaEditar.stock !== undefined && bebidaEditar.stock !== null
            ? String(bebidaEditar.stock)
            : "",
        imagen: bebidaEditar.imagen || "",
        categorias: bebidaEditar.categorias || [],
        subcategoria: bebidaEditar.subcategoria || "",
        esEstrella: bebidaEditar.esEstrella || false,
      });
      setErrores({});
    } else {
      // si salís del modo edición
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
      setErrores({});
    }
  }, [bebidaEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // ✅ Validaciones
  const validar = () => {
    const err = {};

    if (!formData.nombre.trim()) {
      err.nombre = "El nombre es obligatorio";
    }

    if (!formData.categorias || formData.categorias.length === 0) {
      err.categorias = "Seleccioná al menos una categoría";
    }

    if (formData.precio === "") {
      err.precio = "El precio es obligatorio";
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      err.precio = "Ingresá un precio válido mayor a 0";
    }

    if (
      formData.stock !== "" &&
      (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)
    ) {
      err.stock = "El stock debe ser un número mayor o igual a 0";
    }

    // si es vino y seleccionó subcategoria vacía
    if (formData.categorias.includes("Vinos") && !formData.subcategoria) {
      err.subcategoria = "Seleccioná el tipo de vino";
    }

    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);

    if (Object.keys(err).length > 0) return;

    const payload = {
      ...bebidaEditar, // por si desde el padre usan este objeto como base
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio: Number(formData.precio),
      stock: formData.stock === "" ? 0 : Number(formData.stock),
      imagen: formData.imagen.trim(),
      categorias: formData.categorias,
      subcategoria: formData.subcategoria,
      esEstrella: formData.esEstrella,
    };

    onSubmit(payload);

    // Si es alta nueva, limpio el formulario
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
      setErrores({});
    }
  };

  // Verifica si "Vinos" está seleccionado
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
          className={`bg-white border rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 outline-none ${
            errores.nombre
              ? "border-red-400 focus:ring-red-400"
              : "border-[#CDC7BD] focus:ring-[#A30404]"
          }`}
          placeholder="Malbec Reserva 2019"
        />
        {errores.nombre && (
          <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>
        )}
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

      {/* CATEGORÍAS MÚLTIPLES */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-3">
          Categorías * (Selección múltiple)
        </label>
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-3 rounded-lg p-4 ${
            errores.categorias
              ? "border-2 border-red-400 bg-[#FFF5F5]"
              : "border border-[#CDC7BD] bg-[#F7F5F2]"
          }`}
        >
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
        {errores.categorias && (
          <p className="text-xs text-red-600 mt-1">{errores.categorias}</p>
        )}
        {formData.categorias.length > 0 && !errores.categorias && (
          <p className="text-xs text-[#736D66] mt-2">
            Seleccionadas: {formData.categorias.join(", ")}
          </p>
        )}
      </div>

      {/* SUBCATEGORÍA DE VINOS */}
      {esVinoSeleccionado && (
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Tipo de Vino
          </label>
          <select
            name="subcategoria"
            value={formData.subcategoria}
            onChange={handleChange}
            className={`bg-white border rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 outline-none ${
              errores.subcategoria
                ? "border-red-400 focus:ring-red-400"
                : "border-[#CDC7BD] focus:ring-[#A30404]"
            }`}
          >
            <option value="">Seleccionar tipo</option>
            {subcategoriasVinos.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          {errores.subcategoria && (
            <p className="text-xs text-red-600 mt-1">{errores.subcategoria}</p>
          )}
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
          <span className="text-sm font-semibold text-[#04090C]">
            ⭐ Destacar como Producto Estrella
          </span>
        </label>
        <p className="text-xs text-[#736D66] mt-2">
          Los productos destacados aparecen en la sección principal antes del
          catálogo.
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
            step="0.01"
            className={`bg-white border rounded-lg w-full py-3 px-4 text-[#04090C] ${
              errores.precio
                ? "border-red-400 focus:ring-2 focus:ring-red-400"
                : "border-[#CDC7BD] focus:ring-2 focus:ring-[#A30404]"
            }`}
            placeholder="0.00"
          />
          {errores.precio && (
            <p className="text-xs text-red-600 mt-1">{errores.precio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`bg-white border rounded-lg w-full py-3 px-4 text-[#04090C] ${
              errores.stock
                ? "border-red-400 focus:ring-2 focus:ring-red-400"
                : "border-[#CDC7BD] focus:ring-2 focus:ring-[#A30404]"
            }`}
            placeholder="0"
          />
          {errores.stock && (
            <p className="text-xs text-red-600 mt-1">{errores.stock}</p>
          )}
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
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/128x128/CDC7BD/04090C?text=Sin+Img";
            }}
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
