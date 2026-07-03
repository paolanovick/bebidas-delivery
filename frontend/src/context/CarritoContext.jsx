import { createContext, useContext, useState, useEffect, useRef } from "react";
import { pulseCartTarget } from "../utils/flyToCart";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(
    JSON.parse(sessionStorage.getItem("carrito")) || []
  );
  const carritoRef = useRef(carrito);

  // ✅ Vaciar carrito automáticamente al recargar la página
  useEffect(() => {
    sessionStorage.removeItem("carrito");
    carritoRef.current = [];
    setCarrito([]);
  }, []);

  const obtenerId = (item) => item?._id || item?.id;

  const guardarCarrito = (nuevoCarrito) => {
    carritoRef.current = nuevoCarrito;
    setCarrito(nuevoCarrito);
    sessionStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new CustomEvent("carrito:updated"));
  };

  const normalizarOpciones = (opciones = {}) =>
    typeof opciones === "boolean" ? { mostrarAlerta: opciones } : opciones;

  const debeRespetarStock = (bebida, opciones = {}) =>
    opciones.respetarStock ?? !bebida.ventaSinControlStock;

  const puedeAgregar = (bebida, opciones = {}) => {
    const opts = normalizarOpciones(opciones);
    const mostrarAlerta = opts.mostrarAlerta ?? true;

    if (!debeRespetarStock(bebida, opts)) {
      return true;
    }

    if (bebida.stock <= 0) {
      if (mostrarAlerta) {
        alert(`❗ La bebida "${bebida.nombre}" no tiene stock disponible.`);
      }
      return false;
    }

    const idBebida = obtenerId(bebida);
    const existe = carritoRef.current.find((i) => obtenerId(i) === idBebida);

    if (existe && existe.cantidad + 1 > bebida.stock) {
      if (mostrarAlerta) {
        alert(`❗ No puedes agregar más. Stock disponible: ${bebida.stock}`);
      }
      return false;
    }

    return true;
  };

  const agregar = (bebida, opciones = {}) => {
    const opts = normalizarOpciones(opciones);
    if (!puedeAgregar(bebida, opts)) return false;

    const idBebida = obtenerId(bebida);
    const existe = carritoRef.current.find((i) => obtenerId(i) === idBebida);
    const ventaSinControlStock = !debeRespetarStock(bebida, opts);
    const origenCarrito = opts.origenCarrito || bebida.origenCarrito;
    let nuevo;

    if (existe) {
      nuevo = carritoRef.current.map((i) =>
        obtenerId(i) === idBebida
          ? {
              ...i,
              cantidad: i.cantidad + 1,
              origenCarrito: i.origenCarrito || origenCarrito,
              ventaSinControlStock:
                i.ventaSinControlStock || ventaSinControlStock,
            }
          : i
      );
    } else {
      nuevo = [
        ...carritoRef.current,
        {
          ...bebida,
          cantidad: 1,
          origenCarrito,
          ventaSinControlStock,
        },
      ];
    }

    guardarCarrito(nuevo);
    pulseCartTarget();

    return true;
  };

  const modificarCantidad = (id, cantidad) => {
    const nuevo = carrito.map((item) =>
      (item._id || item.id) === id ? { ...item, cantidad } : item
    );
    guardarCarrito(nuevo);
  };

  const eliminar = (id) => {
    guardarCarrito(carrito.filter((item) => (item._id || item.id) !== id));
  };

  // ✅ Vaciar completamente el carrito (para logout, etc.)
  const vaciarCarrito = () => {
    carritoRef.current = [];
    setCarrito([]);
    sessionStorage.removeItem("carrito");
    window.dispatchEvent(new CustomEvent("carrito:updated"));
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregar,
        puedeAgregar,
        modificarCantidad,
        eliminar,
        guardarCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
