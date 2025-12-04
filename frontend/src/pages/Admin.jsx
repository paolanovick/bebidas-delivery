import React, { useState, useEffect } from "react";
import AdminPedidos from "../admin/AdminPedidos";
import AdminUsuarios from "../admin/AdminUsuarios";
import BebidasForm from "../components/BebidasForm";
import BebidasList from "../components/BebidasList";
import ConfiguracionHorarios from "./ConfiguracionHorarios";
import { Menu, X } from "lucide-react";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "../services/api";
import PublicidadAdmin from "../admin/PublicidadAdmin";


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
      await cargarBebidas();
      // ✅ refresca sin recargar la página
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
          <button
            onClick={() => cambiarSeccion("publicidad")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "publicidad"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            🖼️ Publicidad
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
          <button
            onClick={() => cambiarSeccion("publicidad")}
            className={`text-left px-4 py-3 rounded-lg transition-all ${
              seccion === "publicidad"
                ? "bg-[#A30404] shadow-lg"
                : "hover:bg-[#A30404] hover:shadow-md"
            }`}
          >
            🖼️ Publicidad
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
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#f3f5f7]">
                  Gestión de Bebidas
                </h1>
                <p className="text-sm text-[#736D66]">
                  Carga, edita y organiza tus productos de forma rápida.
                </p>
              </div>
              {/* Botones de acceso rápido */}
              <div className="flex gap-3">
                {/* <button
                  onClick={() => cambiarSeccion("horarios")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md text-sm hover:bg-[#A30404] transition"
                >
                  ⏰ Horarios
                </button> */}

                <button
                  onClick={() => cambiarSeccion("publicidad")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md text-sm hover:bg-[#A30404] transition"
                >
                  🖼️ Publicidad
                </button>
              </div>

              {/* Pequeño resumen rápido */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white shadow-md rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-[#04090C]">
                    Total bebidas:
                  </span>{" "}
                  <span className="text-[#590707] font-bold">
                    {bebidas.length}
                  </span>
                </div>
                <div className="bg-white shadow-md rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-[#04090C]">
                    Sin stock:
                  </span>{" "}
                  <span className="text-[#A30404] font-bold">
                    {bebidas.filter((b) => (b.stock ?? 0) <= 0).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Form + Lista en 2 columnas en escritorio */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white shadow-xl rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-3 text-[#04090C]">
                  {editing ? "✏️ Editar bebida" : "🆕 Nueva bebida"}
                </h2>
                <BebidasForm
                  onSubmit={editing ? handleEdit : handleAdd}
                  bebidaEditar={editing}
                />
              </div>

              <div>
                <BebidasList
                  bebidas={bebidas}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  showStock={true}
                />
              </div>
            </div>
          </div>
        )}

        {seccion === "usuarios" && <AdminUsuarios />}
        {seccion === "horarios" && <ConfiguracionHorarios />}
        {seccion === "publicidad" && <PublicidadAdmin />}
      </main>
    </div>
  );
};

export default Admin;
