import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(
    JSON.parse(sessionStorage.getItem("carrito")) || []
  );

  // ✅ Vaciar carrito automáticamente al recargar la página
  useEffect(() => {
    sessionStorage.removeItem("carrito");
    setCarrito([]);
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    sessionStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
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

    // 🔔 Animación del icono del carrito (rebote al agregar)
    const icono = document.getElementById("icono-carrito");
    if (icono) {
      icono.classList.add("animate-bounce");
      setTimeout(() => icono.classList.remove("animate-bounce"), 800);
    }
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
    setCarrito([]);
    sessionStorage.removeItem("carrito");
    window.dispatchEvent(new CustomEvent("carrito:updated"));
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregar,
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
