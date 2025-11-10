// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Componentes
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
import { CarritoProvider } from "./context/CarritoContext"; // ✅ IMPORTAR// <-- AGREGA ESTA IMPORTACIÓN
import { BebidasProvider } from "./context/BebidasContext";
import Inicio from "./pages/Inicio";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "./services/api";

function App() {
  const { usuario, loading } = useAuth();
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
   <Router>
     <BebidasProvider>
       <CarritoProvider>
         <div className="min-h-screen bg-[#04090C] text-[#FFFFFF] font-sans">
           <Navbar />

           <div className="max-w-7xl mx-auto p-6">
             <Routes>
               <Route path="/" element={<Inicio />} />
               <Route path="/inicio" element={<Inicio />} />

               <Route
                 path="/login"
                 element={usuario ? <Navigate to="/tienda" /> : <Login />}
               />
               {/* REGISTRO */}
               <Route
                 path="/registro"
                 element={usuario ? <Navigate to="/tienda" /> : <Registro />}
               />
               {/* LOGIN ADMIN */}
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
               {/* MIS PEDIDOS - Solo clientes logueados */}
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
               {/* PANEL ADMIN - Solo admin */}
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
                       />
                     </>
                   ) : (
                     <Navigate to="/login-admin" />
                   )
                 }
               />
               {/* PEDIDOS ADMIN - Solo admin */}
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
                 path="/pedido"
                 element={usuario ? <Pedido /> : <Navigate to="/login" />}
               />
             </Routes>
           </div>
           <Footer />
           <Toaster position="top-right" />
         </div>
       </CarritoProvider>
     </BebidasProvider>
   </Router>
 );
  
}

export default App;
