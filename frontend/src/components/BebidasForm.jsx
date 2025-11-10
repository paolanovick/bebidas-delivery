import React, { useState, useEffect } from "react";

const BebidasForm = ({ onSubmit, bebidaEditar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoria: "",
  });

  useEffect(() => {
    if (bebidaEditar) {
      setFormData({
        nombre: bebidaEditar.nombre || "",
        descripcion: bebidaEditar.descripcion || "",
        precio: bebidaEditar.precio || "",
        stock: bebidaEditar.stock || "",
        imagen: bebidaEditar.imagen || "",
        categoria: bebidaEditar.categoria || "",
      });
    }
  }, [bebidaEditar]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock), // ✅ IMPORTANTE
    });

    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: 0, // ✅
      imagen: "",
      categoria: "",
    });
  };

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

      {/* Categoría */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Categoría *</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          className="bg-white border border-[#CDC7BD] rounded-lg w-full py-3 px-4 text-[#04090C] focus:ring-2 focus:ring-[#A30404] outline-none"
        >
          <option value="">Seleccionar categoría</option>
          <option value="Vinos">Vinos</option>
          <option value="Cervezas">Cervezas</option>
          <option value="Espumantes">Espumantes</option>
          <option value="Whisky">Whisky</option>
          <option value="Blancas">Blancas</option>
          <option value="Licores">Licores</option>
          <option value="Aperitivos">Aperitivos</option>
          <option value="Espirituosas">Espirituosas</option>
          <option value="Mayoristas">Mayoristas</option>
          <option value="Ofertas">Ofertas</option>
          <option value="Regalos">Regalos</option>
          <option value="Gift Cards">Gift Cards</option>
          <option value="Wine Club">Wine Club</option>
          <option value="Experiencias">Experiencias</option>
        </select>
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
