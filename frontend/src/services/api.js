// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL;

const API_URL_BEBIDAS = `${BASE_URL}/bebidas`;
const API_URL_USUARIOS = `${BASE_URL}/usuarios`;
const API_URL_PEDIDOS = `${BASE_URL}/pedidos`;
const API_URL_HORARIOS = `${BASE_URL}/horarios`;

// Obtener token del localStorage
const getToken = () => localStorage.getItem("token");

/* ============================
   FUNCIONES PARA BEBIDAS
============================ */

// Obtener todas las bebidas
export const getBebidas = async () => {
  const res = await fetch(API_URL_BEBIDAS);
  if (!res.ok) throw new Error("Error al obtener bebidas");
  return res.json();
};

// Agregar una nueva bebida
export const agregarBebida = async (bebida) => {
  const token = getToken();
  const res = await fetch(API_URL_BEBIDAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bebida),
  });

  if (!res.ok) throw new Error("Error al agregar bebida");
  return res.json();
};

// Editar bebida
export const editarBebida = async (id, bebida) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(bebida),
  });

  if (!res.ok) throw new Error("Error al editar bebida");
  return res.json();
};

// Eliminar bebida
export const eliminarBebida = async (id) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar bebida");
  return res.json();
};

/* ============================
   USUARIOS
============================ */

export const loginUsuario = async (email, contrasena) => {
  const res = await fetch(`${API_URL_USUARIOS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena }),
  });

  if (!res.ok) throw new Error("Error al iniciar sesión");
  return res.json();
};

export const registrarUsuario = async (nombre, email, contrasena) => {
  const res = await fetch(`${API_URL_USUARIOS}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, contrasena }),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
};

/* ============================
   PEDIDOS
============================ */

export const crearPedido = async (pedidoData) => {
  const res = await fetch(API_URL_PEDIDOS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(pedidoData),
  });

  if (!res.ok) throw new Error("Error al crear pedido");
  return res.json();
};

export const obtenerMisPedidos = async () => {
  const res = await fetch(`${API_URL_PEDIDOS}/mis-pedidos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
};

/* ============================
   HORARIOS
============================ */

export const obtenerConfiguracionHorarios = async () => {
  const res = await fetch(`${API_URL_HORARIOS}/configuracion`);
  if (!res.ok) throw new Error("Error al obtener configuración");
  return res.json();
};

export const actualizarConfiguracionHorarios = async (config) => {
  const res = await fetch(`${API_URL_HORARIOS}/configuracion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(config),
  });

  if (!res.ok) throw new Error("Error al actualizar configuración");
  return res.json();
};

export const obtenerSlotsDisponibles = async (fecha) => {
  const res = await fetch(
    `${API_URL_HORARIOS}/slots-disponibles?fecha=${fecha}`
  );
  if (!res.ok) throw new Error("Error al obtener horarios");
  return res.json();
};
