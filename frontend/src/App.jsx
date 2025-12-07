import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useBebidas } from "./context/BebidasContext";

import Navbar from "./components/Navbar";
import BebidasForm from "./components/BebidasForm";
import BebidasListCategorias from "./components/BebidasListCategorias";
import Login from "./components/Login";
import Registro from "./components/Registro";
import MisPedidos from "./components/MisPedidos";
import LoginAdmin from "./components/LoginAdmin";
import MenuBebidas from "./components/MenuBebidas";
import AdminPedidos from "./pages/AdminPedidos";
import Pedido from "./pages/Pedido";
import { CarritoProvider } from "./context/CarritoContext";
import { BebidasProvider } from "./context/BebidasContext";
import Inicio from "./pages/Inicio";
import Footer from "./components/Footer";

import AgeGateModal from "./components/AgeGateModal";
import WhatsAppButton from "./components/WhatsAppButton";
import ConfiguracionHorarios from "./pages/ConfiguracionHorarios";
import PublicidadModal from "./components/PublicidadModal";
import PublicidadAdmin from "./pages/PublicidadAdmin";

function AppContent() {
  const { usuario } = useAuth();
  const location = useLocation();
  const ocultarFooter = location.pathname.startsWith("/admin");

  const { bebidas, agregar, editar, eliminar } = useBebidas();
  const [editing, setEditing] = useState(null);

  const handleAdd = async (bebida) => {
    try {
      await agregar(bebida);
      setEditing(null);
    } catch (error) {
      console.error("Error al agregar bebida:", error);
    }
  };

  const handleEdit = async (bebida) => {
    try {
      await editar(editing._id, bebida);
      setEditing(null);
    } catch (error) {
      console.error("Error al editar bebida:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminar(id);
    } catch (error) {
      console.error("Error al eliminar bebida:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#04090C] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 pt-28 md:pt-6">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />

          <Route
            path="/login"
            element={usuario ? <Navigate to="/tienda" /> : <Login />}
          />
          <Route
            path="/registro"
            element={usuario ? <Navigate to="/tienda" /> : <Registro />}
          />

          <Route
            path="/login-admin"
            element={
              usuario && usuario.rol === "admin" ? (
                <Navigate to="/admin/bebidas-categorias" />
              ) : (
                <LoginAdmin />
              )
            }
          />

          <Route
            path="/mis-pedidos"
            element={
              usuario && usuario.rol !== "admin" ? (
                <MisPedidos />
              ) : (
                <Navigate to="/tienda" />
              )
            }
          />

          {/* TIENDA (front) */}
          <Route path="/tienda" element={<MenuBebidas />} />

          {/* CONFIG HORARIOS (admin) */}
          <Route
            path="/admin/horarios"
            element={
              usuario && usuario.rol === "admin" ? (
                <ConfiguracionHorarios />
              ) : (
                <Navigate to="/login-admin" />
              )
            }
          />

          {/* /admin -> SOLO formulario de bebidas */}
          <Route
            path="/admin"
            element={
              usuario && usuario.rol === "admin" ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-[#CDC7BD]">
                      Formulario de Bebidas
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/bebidas-categorias"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        Ver catálogo por categoría
                      </Link>

                      <Link
                        to="/admin/horarios"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        Horarios de entrega
                      </Link>

                      <Link
                        to="/admin/publicidad"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        Publicidad
                      </Link>
                    </div>
                  </div>

                  <BebidasForm
                    onSubmit={editing ? handleEdit : handleAdd}
                    bebidaEditar={editing}
                    onCancel={() => setEditing(null)}
                  />
                </>
              ) : (
                <Navigate to="/login-admin" />
              )
            }
          />

          {/* Catálogo por categoría */}
          <Route
            path="/admin/bebidas-categorias"
            element={
              usuario && usuario.rol === "admin" ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <h2 className="text-3xl font-bold text-[#CDC7BD]">
                      Catálogo de Bebidas
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        + Nueva / Editar bebida
                      </Link>

                      <Link
                        to="/admin/horarios"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        Horarios de entrega
                      </Link>

                      <Link
                        to="/admin/publicidad"
                        className="bg-[#590707] hover:bg-[#A30404] text-white text-sm px-4 py-2 rounded-lg shadow-md"
                      >
                        Publicidad
                      </Link>
                    </div>
                  </div>

                  <BebidasListCategorias
                    bebidas={bebidas}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                    showStock={true}
                  />
                </>
              ) : (
                <Navigate to="/login-admin" />
              )
            }
          />

          {/* Pantalla independiente de PUBLICIDAD */}
          <Route
            path="/admin/publicidad"
            element={
              usuario && usuario.rol === "admin" ? (
                <PublicidadAdmin />
              ) : (
                <Navigate to="/login-admin" />
              )
            }
          />
          <Route
            path="/admin-pedidos"
            element={
              usuario && usuario.rol === "admin" ? (
                <AdminPedidos />
              ) : (
                <Navigate to="/login-admin" />
              )
            }
          />

          <Route path="/pedido" element={<Pedido />} />
        </Routes>
      </div>

      {!ocultarFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <BebidasProvider>
        <CarritoProvider>
          {/* MODALES GLOBALES */}
          <AgeGateModal />
          <PublicidadModal />

          {/* CONTENIDO GENERAL */}
          <AppContent />
        </CarritoProvider>
      </BebidasProvider>
    </Router>
  );
}
