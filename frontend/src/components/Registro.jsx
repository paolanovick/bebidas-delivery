import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrarUsuario } from "../services/api";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const data = await registrarUsuario(nombre, email, contrasena);
      setMensaje(data.mensaje);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] shadow-md rounded-lg p-8"
      >
        <h2
          className="text-3xl font-bold text-center mb-6"
          style={{ color: "#590707" }}
        >
          Crear Cuenta
        </h2>

        {mensaje && (
          <div
            className="px-4 py-3 rounded mb-4"
            style={{ backgroundColor: "#736D66", color: "#FFFFFF" }}
          >
            {mensaje}
          </div>
        )}

        {error && (
          <div
            className="px-4 py-3 rounded mb-4"
            style={{ backgroundColor: "#A30404", color: "#FFFFFF" }}
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: "#736D66" }}
          >
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Tu nombre"
            className="w-full px-3 py-2 rounded focus:outline-none"
            style={{
              border: "1px solid #CDC7BD",
              color: "#04090C",
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: "#736D66" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            className="w-full px-3 py-2 rounded focus:outline-none"
            style={{
              border: "1px solid #CDC7BD",
              color: "#04090C",
            }}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: "#736D66" }}
          >
            Contraseña
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            minLength="6"
            placeholder="Mínimo 6 caracteres"
            className="w-full px-3 py-2 rounded focus:outline-none"
            style={{
              border: "1px solid #CDC7BD",
              color: "#04090C",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-bold py-3 rounded disabled:bg-gray-400"
          style={{
            backgroundColor: "#590707",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#A30404")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#590707")}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center mt-4" style={{ color: "#736D66" }}>
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="hover:underline"
            style={{ color: "#590707" }}
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Registro;
