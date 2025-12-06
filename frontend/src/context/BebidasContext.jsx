import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getBebidas,
  agregarBebida,
  editarBebida,
  eliminarBebida,
} from "../services/api";

const BebidasContext = createContext();

export const BebidasProvider = ({ children }) => {
  const [bebidas, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔥 Normalizar cada bebida para evitar errores en Frontend
  const normalizarBebida = (b) => {
    return {
      ...b,
      categorias: Array.isArray(b.categorias)
        ? b.categorias
        : b.categoria
        ? [b.categoria]
        : [],
      subcategoria: b.subcategoria || "",
    };
  };

  // 🔥 Cargar bebidas desde API
  const cargarBebidas = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getBebidas();

      // Normalizar TODAS las bebidas
      const normalizadas = data.map((b) => normalizarBebida(b));

      setBebidas(normalizadas);
    } catch (error) {
      console.error("❌ Error al cargar bebidas:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarBebidas();
  }, [cargarBebidas]);

  // 🔥 Agregar bebida
  const agregar = async (bebida) => {
    try {
      await agregarBebida(bebida);
      await cargarBebidas(); // refresco automático
    } catch (error) {
      console.error("❌ Error al agregar bebida:", error);
    }
  };

  // 🔥 Editar bebida
  const editar = async (id, bebida) => {
    try {
      const actualizada = await editarBebida(id, bebida);
      const normalizada = normalizarBebida(actualizada);

      setBebidas((prev) => prev.map((b) => (b._id === id ? normalizada : b)));
    } catch (error) {
      console.error("❌ Error al editar bebida:", error);
    }
  };

  // 🔥 Eliminar bebida
  const eliminar = async (id) => {
    try {
      await eliminarBebida(id);
      setBebidas((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar bebida:", error);
    }
  };

  return (
    <BebidasContext.Provider
      value={{
        bebidas,
        cargando,
        cargarBebidas,
        agregar,
        editar,
        eliminar,
      }}
    >
      {children}
    </BebidasContext.Provider>
  );
};

export const useBebidas = () => useContext(BebidasContext);
