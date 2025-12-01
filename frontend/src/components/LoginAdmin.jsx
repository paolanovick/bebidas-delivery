import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUsuario } from "../services/api";

const LoginAdmin = () => {
  const [email, setEmail] = useState("bebidas@gmail.com");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUsuario({ email, contrasena });
      login(data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[#590707]">
          Login Admin
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
            required
            className="w-full px-3 py-2 rounded focus:outline-none border border-[#CDC7BD] text-[#04090C] focus:border-[#590707] focus:ring-1 focus:ring-[#590707]"
          />
        </div>

        <button
          type="submit"
          className="w-full font-bold py-3 rounded bg-[#590707] text-white hover:bg-[#A30404] transition-colors"
        >
          Admin
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
