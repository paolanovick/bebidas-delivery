import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUsuario } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUsuario(email, contrasena);
      if (data.token) {
        login(data.token);
        navigate("/tienda");
      }
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#590707]">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="px-4 py-3 rounded mb-4 bg-[#A30404] text-white">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-[#736D66]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
            autoComplete="email"
            className="w-full px-3 py-2 rounded focus:outline-none border border-[#CDC7BD] text-[#04090C] focus:border-[#590707] focus:ring-1 focus:ring-[#590707]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-[#736D66]">
            Contraseña
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded focus:outline-none border border-[#CDC7BD] text-[#04090C] focus:border-[#590707] focus:ring-1 focus:ring-[#590707]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-bold py-3 rounded bg-[#590707] text-white hover:bg-[#A30404] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <p className="text-center mt-4 text-[#736D66]">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-[#590707] hover:underline font-semibold"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
