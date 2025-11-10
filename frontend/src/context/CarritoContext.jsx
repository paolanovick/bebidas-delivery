import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new CustomEvent("carrito:updated"));
  };

  const agregar = (bebida) => {
    if (bebida.stock <= 0) {
      alert(`❗ La bebida "${bebida.nombre}" no tiene stock disponible.`);
      return;
    }

    const existe = carrito.find((i) => i._id === bebida._id);
    let nuevo;

    if (existe) {
      if (existe.cantidad + 1 > bebida.stock) {
        alert(`❗ No puedes agregar más. Stock disponible: ${bebida.stock}`);
        return;
      }
      nuevo = carrito.map((i) =>
        i._id === bebida._id ? { ...i, cantidad: i.cantidad + 1 } : i
      );
    } else {
      nuevo = [...carrito, { ...bebida, cantidad: 1 }];
    }

    guardarCarrito(nuevo);
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

  // ✅ NUEVO: Vaciar el carrito
  const vaciarCarrito = () => {
    guardarCarrito([]); // ✅ Limpia todo
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregar,
        modificarCantidad,
        eliminar,
        guardarCarrito,
        vaciarCarrito, // 👈 AGREGADO
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
