import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      const res = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al iniciar sesión");

      login(data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
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
        Login Admin
      </h2>

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
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          className="w-full px-3 py-2 rounded focus:outline-none"
          style={{
            border: "1px solid #CDC7BD",
            color: "#04090C",
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full font-bold py-3 rounded"
        style={{
          backgroundColor: "#590707",
          color: "#FFFFFF",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#A30404")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#590707")}
      >
        Iniciar Sesión Admin
      </button>
    </form>
  </div>
);

};

export default LoginAdmin;
