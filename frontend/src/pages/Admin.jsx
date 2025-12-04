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
    } catch (error) {
      console.error("Error al agregar bebida:", error);
    }
  };

  const handleEdit = async (bebida) => {
    try {
      await editarBebida(editing._id, bebida);
      await cargarBebidas();
      setEditing(null);
    } catch (error) {
      console.error("Error al editar bebida:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarBebidas(id);
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
      {/* 📌 SIDEBAR ESCRITORIO */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#590707] text-white py-6 px-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[#A30404] pb-4">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => cambiarSeccion("pedidos")}
            className={`text-left px 4 py-3 rounded-lg transition-all ${
              seccion === "pedidos" ? "bg-[#A30404]" : "hover:bg-[#A30404]"
            }`}
          >
            📋 Pedidos
          </button>

          <button
            onClick={() => cambiarSeccion("bebidas")}
            className={`text-left px 4 py-3 rounded-lg transition-all ${
              seccion === "bebidas" ? "bg-[#A30404]" : "hover:bg-[#A30404]"
            }`}
          >
            🥤 Bebidas
          </button>

          <button
            onClick={() => cambiarSeccion("usuarios")}
            className={`text-left px 4 py-3 rounded-lg transition-all ${
              seccion === "usuarios" ? "bg-[#A30404]" : "hover:bg-[#A30404]"
            }`}
          >
            👥 Usuarios
          </button>

          <button
            onClick={() => cambiarSeccion("horarios")}
            className={`text-left px 4 py-3 rounded-lg transition-all ${
              seccion === "horarios" ? "bg-[#A30404]" : "hover:bg-[#A30404]"
            }`}
          >
            ⏰ Horarios
          </button>

          <button
            onClick={() => cambiarSeccion("publicidad")}
            className={`text-left px 4 py-3 rounded-lg transition-all ${
              seccion === "publicidad" ? "bg-[#A30404]" : "hover:bg-[#A30404]"
            }`}
          >
            🖼️ Publicidad
          </button>
        </nav>
      </aside>

      {/* 📱 SIDEBAR MOBILE */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#590707] text-white w-64 transform ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 z-40 flex flex-col py-6 px-4 md:hidden shadow-2xl`}
      >
        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[#A30404] pb-4">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => cambiarSeccion("pedidos")}
            className="admin-btn"
          >
            📋 Pedidos
          </button>
          <button
            onClick={() => cambiarSeccion("bebidas")}
            className="admin-btn"
          >
            🥤 Bebidas
          </button>
          <button
            onClick={() => cambiarSeccion("usuarios")}
            className="admin-btn"
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => cambiarSeccion("horarios")}
            className="admin-btn"
          >
            ⏰ Horarios
          </button>
          <button
            onClick={() => cambiarSeccion("publicidad")}
            className="admin-btn"
          >
            🖼️ Publicidad
          </button>
        </nav>
      </div>

      {/* BOTÓN HAMBURGUESA */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="bg-[#590707] text-white p-2 rounded-lg shadow-lg hover:bg-[#A30404]"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 📌 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 mt-16 md:mt-0">
        {/* ---------------- PEDIDOS ---------------- */}
        {seccion === "pedidos" && <AdminPedidos />}

        {/* ---------------- BEBIDAS (FORM Y LISTA) ---------------- */}
        {seccion === "bebidas" && (
          <div className="space-y-6">
            {/* 🔘 BOTONES: CATALOGO + HORARIOS + PUBLICIDAD */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[#04090C]">
                Gestión de Bebidas
              </h1>

              <div className="flex gap-3">
                <button
                  onClick={() => cambiarSeccion("categorias")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#A30404]"
                >
                  Ver catálogo por categoría
                </button>

                <button
                  onClick={() => cambiarSeccion("horarios")}
                  className="bg-[#CDC7BD] text-[#04090C] px-4 py-2 rounded-lg shadow-md border border-[#CDC7BD]"
                >
                  ⏰ Horarios de entrega
                </button>

                <button
                  onClick={() => cambiarSeccion("publicidad")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#A30404]"
                >
                  🖼️ Publicidad
                </button>
              </div>
            </div>

            {/* FORM + LISTA */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white shadow-xl rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-3 text-[#04090C]">
                  {editing ? "✏️ Editar bebida" : "🆕 Nueva bebida"}
                </h2>

                <BebidasForm
                  onSubmit={editing ? handleEdit : handleAdd}
                  bebidaEditar={editing}
                  onCancel={() => setEditing(null)}
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

        {/* ---------------- CATALOGO ---------------- */}
        {seccion === "categorias" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#04090C]">
                Catálogo de Bebidas
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => cambiarSeccion("bebidas")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#A30404]"
                >
                  + Nueva / Editar bebida
                </button>

                <button
                  onClick={() => cambiarSeccion("publicidad")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#A30404]"
                >
                  🖼️ Publicidad
                </button>

                <button
                  onClick={() => cambiarSeccion("horarios")}
                  className="bg-[#590707] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#A30404]"
                >
                  ⏰ Horarios de entrega
                </button>
              </div>
            </div>

            <BebidasList
              bebidas={bebidas}
              onEdit={setEditing}
              onDelete={handleDelete}
              showStock={true}
            />
          </div>
        )}

        {/* ---------------- USUARIOS ---------------- */}
        {seccion === "usuarios" && <AdminUsuarios />}

        {/* ---------------- HORARIOS ---------------- */}
        {seccion === "horarios" && <ConfiguracionHorarios />}

        {/* ---------------- PUBLICIDAD ---------------- */}
        {seccion === "publicidad" && <PublicidadAdmin />}
      </main>
    </div>
  );
};

export default Admin;
