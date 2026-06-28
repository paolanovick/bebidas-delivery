export const INGRESO_TIENDA_KEY = "eldanes_ingreso_tienda";

export const habilitarIngresoTienda = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(INGRESO_TIENDA_KEY, "true");
};

export const tieneIngresoTienda = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(INGRESO_TIENDA_KEY) === "true";
};

export const esRutaIngreso = (pathname) =>
  pathname === "/" || pathname === "/inicio";

export const esRutaEcommerce = (pathname) =>
  pathname === "/tienda" || pathname === "/pedido";
