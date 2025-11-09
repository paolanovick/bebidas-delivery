// src/services/api.js
// src/services/api.js
// src/services/api.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔍 BASE_URL configurada:', BASE_URL); // ← Debug

const API_URL_BEBIDAS = `${BASE_URL}/bebidas`;
// ... resto del código
const API_URL_USUARIOS = `${BASE_URL}/usuarios`;
const API_URL_PEDIDOS = `${BASE_URL}/pedidos`;
const API_URL_HORARIOS = `${BASE_URL}/horarios`;







// Obtener token del localStorage
const getToken = () => localStorage.getItem("token");


/* ============================
   FUNCIONES PARA BEBIDAS
============================ */

// Obtener todas las bebidas
// Obtener todas las bebidas
export const getBebidas = async () => {
  try {
    console.log('📡 Fetching desde:', API_URL_BEBIDAS);
    
    const res = await fetch(API_URL_BEBIDAS);
    
    console.log('📊 Status:', res.status);
    console.log('📊 Content-Type:', res.headers.get('content-type'));
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Error response:', text);
      throw new Error(`Error ${res.status}: ${text.substring(0, 100)}`);
    }
    
    const data = await res.json();
    console.log('✅ Bebidas recibidas:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    throw error;
  }
};


// Agregar una nueva bebida
export const agregarBebida = async (bebida) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL_BEBIDAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ Ahora sí
    },
    body: JSON.stringify(bebida),
  });

  if (!res.ok) {
    throw new Error("Error al agregar bebida");
  }

  return await res.json();
};


// Editar bebida por ID
export const editarBebida = async (id, bebida) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, // ✅ token
    },
    body: JSON.stringify(bebida),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.mensaje || "Error al editar bebida");
  }
  return res.json();
};

// (Opcional) Eliminar bebida también suele requerir token:
export const eliminarBebida = async (id) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`, // ✅ token
    },
  });
  if (!res.ok) throw new Error("Error al eliminar bebida");
  return res.json();
};
/* ============================
   FUNCIONES PARA USUARIOS
============================ */

// Login de usuario
export const loginUsuario = async (email, contrasena) => {
  const res = await fetch(`${API_URL_USUARIOS}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, contrasena }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al iniciar sesión");
  }
  return res.json();
};

// Registro de usuario
export const registrarUsuario = async (nombre, email, contrasena) => {
  const res = await fetch(`${API_URL_USUARIOS}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, contrasena }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al registrar usuario");
  }
  return res.json();
};

// ============================
// PEDIDOS
// ============================

export async function crearPedido(pedidoData) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL_PEDIDOS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pedidoData),
  });

  if (!res.ok) throw new Error("Error al crear pedido");
  return await res.json();
}


// Obtener mis pedidos
export const obtenerMisPedidos = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}/mis-pedidos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al obtener pedidos");
  }

  return res.json();
};
// Listar usuarios con sus pedidos (admin)
export const getUsuariosConPedidos = async () => {
  const res = await fetch("/api/usuarios/pedidos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.json();
};

// Después de getUsuariosConPedidos
export const eliminarHistorialUsuario = async (usuarioId) => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}/historial/${usuarioId}`, {  // ← Cambio aquí
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al eliminar historial");
  }
  return res.json();
};


// Listar todos los pedidos (admin)
export const listarTodosPedidos = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al listar pedidos");
  }

  return res.json();
};

// Alias para mantener compatibilidad
export const getPedidos = listarTodosPedidos;

// Eliminar un pedido por ID
export const eliminarPedido = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al eliminar pedido");
  }

  return res.json();
};

// Eliminar todos los pedidos
export const eliminarTodosPedidos = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al eliminar todos los pedidos");
  }

  return res.json();
};




// Actualizar estado del pedido (solo admin)
export const actualizarEstadoPedido = async (id, estado) => {
  const token = getToken();
  const res = await fetch(`${API_URL_PEDIDOS}/${id}/estado`, {
    // ← RUTA CORRECTA
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al actualizar estado");
  }

  return res.json();
};


/* ============================
   FUNCIONES PARA HORARIOS
============================ */

// Obtener configuración de horarios
export const obtenerConfiguracionHorarios = async () => {
  const res = await fetch(`${API_URL_HORARIOS}/configuracion`);
  if (!res.ok) throw new Error("Error al obtener configuración");
  return res.json();
};

// Actualizar configuración de horarios (solo admin)
export const actualizarConfiguracionHorarios = async (config) => {
  const token = getToken();
  const res = await fetch(`${API_URL_HORARIOS}/configuracion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.mensaje || "Error al actualizar configuración");
  }
  return res.json();
};

export async function obtenerSlotsDisponibles(fecha) {
  const res = await fetch(
    `${API_URL_HORARIOS}/slots-disponibles?fecha=${fecha}`
  );
  if (!res.ok) throw new Error("Error al obtener horarios");
  return await res.json();
}





