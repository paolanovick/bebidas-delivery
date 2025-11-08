import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // named import correcto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Verificar expiración
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUsuario(null);
          setLoading(false);
          return;
        }

        setUsuario(decoded);
      } catch (error) {
        localStorage.removeItem("token");
        setUsuario(null);
      }
    }
    setLoading(false);
  }, []);

  // Login con JWT de la API
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUsuario(decoded);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
