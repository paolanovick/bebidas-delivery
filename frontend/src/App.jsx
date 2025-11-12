import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import BebidasForm from "./components/BebidasForm";
import BebidasList from "./components/BebidasList";
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

import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "./services/api";

function AppContent() {
  const { usuario, loading } = useAuth();
  const location = useLocation(); // ✅ ahora sí funciona
  const ocultarFooter = location.pathname.startsWith("/admin");

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
      const nueva = await agregarBebida(bebida);
      setBebidas([...bebidas, nueva]);
    } catch (error) {
      console.error("Error al agregar bebida:", error);
    }
  };

  const handleEdit = async (bebida) => {
    try {
      const actualizada = await editarBebida(editing._id, bebida);
      setBebidas(bebidas.map((b) => (b._id === editing._id ? actualizada : b)));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#04090C]">
        <p className="text-2xl text-[#CDC7BD] font-semibold animate-pulse">
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04090C] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
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
                <Navigate to="/admin" />
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

          <Route path="/tienda" element={<MenuBebidas />} />

          <Route
            path="/admin"
            element={
              usuario && usuario.rol === "admin" ? (
                <>
                  <h2 className="text-3xl font-bold text-center mb-6 text-[#CDC7BD]">
                    Panel de Administración
                  </h2>
                  <BebidasForm
                    onSubmit={editing ? handleEdit : handleAdd}
                    bebidaEditar={editing}
                  />
                  <BebidasList
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

          <Route
           path="/pedido" element={<Pedido />}
          />
        </Routes>
      </div>

      {/* ✅ Footer solo si NO estamos en admin */}
      {!ocultarFooter && <Footer />}

     
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <BebidasProvider>
        <CarritoProvider>
          <AppContent />
        </CarritoProvider>
      </BebidasProvider>
    </Router>
  );
}
