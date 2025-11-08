import { createContext, useContext, useState, useEffect } from "react";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "../services/api";

const BebidasContext = createContext();

export const BebidasProvider = ({ children }) => {
  const [bebidas, setBebidas] = useState([]);

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

  const agregar = async (bebida) => {
    const nueva = await agregarBebida(bebida);
    setBebidas((prev) => [...prev, nueva]);
  };

  const editar = async (id, bebida) => {
    const actualizada = await editarBebida(id, bebida);
    setBebidas((prev) => prev.map((b) => (b._id === id ? actualizada : b)));
  };

  const eliminar = async (id) => {
    await eliminarBebida(id);
    setBebidas((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <BebidasContext.Provider
      value={{ bebidas, setBebidas, cargarBebidas, agregar, editar, eliminar }}
    >
      {children}
    </BebidasContext.Provider>
  );
};

export const useBebidas = () => useContext(BebidasContext);
