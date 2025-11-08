import React, { useState, useEffect } from "react";
import AdminPedidos from "../admin/AdminPedidos";
import AdminUsuarios from "../admin/AdminUsuarios";
import BebidasForm from "../components/BebidasForm";
import BebidasList from "../components/BebidasList";
import ConfiguracionHorarios from "../admin/ConfiguracionHorarios";
import { Menu, X } from "lucide-react";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "../services/api";

const Admin = () => {
  const [seccion, setSeccion] = useState("pedidos");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [bebidas, setBebidas] = useState([]);
  const [editing, setEditing] = useState(null);

  const cargarBebidas = async () => {
    try {
      const data = await getBebidas();
      setBebidas(data);
    } catch (error) {
      console.error("Error al cargar bebidas:", error);
    }
  };

  useEffect(() => {
    cargarBebidas();
  }, []);

const handleAdd = async (bebida) => {
  try {
    await agregarBebida(bebida);
    await cargarBebidas(); // ✅ refresca sin recargar la página
  } catch (error) {
    console.error("Error al agregar bebida:", error);
  }
};


  const handleEdit = async (bebida) => {
    try {
      await editarBebida(editing._id, bebida);
      await cargarBebidas(); // ✅ trae todo actualizado desde el servidor
      setEditing(null);
    } catch (error) {
      console.error("Error al editar bebida:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await eliminarBebida(id);
      setBebidas(bebidas.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error al eliminar bebida:", error);
    }
  };

  const cambiarSeccion = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
    setMenuAbierto(false);
  };

  return (
    <div className="flex min-h-screen bg-[#CDC7BD]">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#590707] text-white py-6 px-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[#A30404] pb-4">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => cambiarSeccion("pedidos")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "pedidos"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            📋 Pedidos
          </button>
          <button
            onClick={() => cambiarSeccion("bebidas")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "bebidas"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            🥤 Bebidas
          </button>
          <button
            onClick={() => cambiarSeccion("usuarios")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "usuarios"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => cambiarSeccion("horarios")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "horarios"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            ⏰ Horarios
          </button>
        </nav>
      </aside>

      {/* Sidebar mobile */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#590707] text-white w-64 transform ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 flex flex-col py-6 px-4 md:hidden shadow-2xl`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[#A30404] pb-4">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => cambiarSeccion("pedidos")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "pedidos"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            📋 Pedidos
          </button>
          <button
            onClick={() => cambiarSeccion("bebidas")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "bebidas"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            🥤 Bebidas
          </button>
          <button
            onClick={() => cambiarSeccion("usuarios")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "usuarios"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => cambiarSeccion("horarios")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "horarios"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            ⏰ Horarios
          </button>
        </nav>
      </div>

      {/* Botón menú hamburguesa */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="bg-[#590707] text-white p-2 rounded-lg shadow-lg hover:bg-[#A30404] transition-colors"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
        {seccion === "pedidos" && <AdminPedidos />}
        {seccion === "bebidas" && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-[#04090C]">
              Gestión de Bebidas
            </h1>
            <BebidasForm
              onSubmit={editing ? handleEdit : handleAdd}
              bebidaEditar={editing}
            />
            <BebidasList
              bebidas={bebidas}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          </div>
        )}
        {seccion === "usuarios" && <AdminUsuarios />}
        {seccion === "horarios" && <ConfiguracionHorarios />}
      </main>
    </div>
  );
};

export default Admin;
