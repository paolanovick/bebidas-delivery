// src/pages/AdminBebidasCategorias.jsx
import React, { useEffect, useState } from "react";
import { getBebidas, editarBebida, eliminarBebida } from "../services/api";
import BebidasListCategorias from "../components/BebidasListCategorias";
import { useNavigate } from "react-router-dom";

const AdminBebidasCategorias = () => {
  const [bebidas, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const cargarBebidas = async () => {
    try {
      setCargando(true);
      const data = await getBebidas();
      setBebidas(data);
    } catch (error) {
      console.error("Error al cargar bebidas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarBebidas();
  }, []);

  const handleEdit = async (bebidaActualizada) => {
    try {
      // bebidaActualizada debería traer _id desde bebidaEditar en el formulario si lo usás así
      await editarBebida(bebidaActualizada._id, bebidaActualizada);
      await cargarBebidas();
    } catch (error) {
      console.error("Error al editar bebida:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta bebida?")) return;
    try {
      await eliminarBebida(id);
      setBebidas((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error al eliminar bebida:", error);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-[#736D66]">Cargando bebidas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header de la pantalla nueva */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#04090C]">
            Gestión de Bebidas (vista por categoría)
          </h1>
          <p className="text-sm text-[#736D66]">
            Vista nueva, más limpia, para revisar tus productos por categoría.
          </p>
        </div>

        {/* Botón para ir a la pantalla de carga (en el futuro la separamos) */}
        <button
          onClick={() => navigate("/admin/bebidas")}
          className="hidden md:inline-block bg-[#590707] hover:bg-[#A30404] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
        >
          ← Volver al panel clásico
        </button>
      </div>

      <BebidasListCategorias
        bebidas={bebidas}
        onEdit={(b) => handleEdit(b)}
        onDelete={handleDelete}
        showStock={true}
      />
    </div>
  );
};

export default AdminBebidasCategorias;
