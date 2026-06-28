// src/services/api.js

const BASE = "/api";  // ✅ Usa el mismo dominio que el frontendCon www

export const API_URL_BEBIDAS = `${BASE}/bebidas`;
export const API_URL_USUARIOS = `${BASE}/usuarios`;
export const API_URL_PEDIDOS = `${BASE}/pedidos`;
export const API_URL_HORARIOS = `${BASE}/horarios`;

const getToken = () => localStorage.getItem("token");

/* ============================
   BEBIDAS
============================ */
export async function getBebidas() {
  const res = await fetch(API_URL_BEBIDAS);
  return res.json();
}

export const agregarBebida = async (bebida) => {
  const res = await fetch(API_URL_BEBIDAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(bebida),
  });
  return res.json();
};

export const editarBebida = async (id, bebida) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(bebida),
  });
  return res.json();
};

export const eliminarBebida = async (id) => {
  const res = await fetch(`${API_URL_BEBIDAS}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

/* ============================
   USUARIOS
============================ */
export const loginUsuario = async (credenciales) => {
  const res = await fetch(`${API_URL_USUARIOS}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credenciales),
  });

  if (!res.ok) {
    const texto = await res.text();
    console.error("❌ Error al iniciar sesión:", res.status, texto);
    throw new Error(`Error en el inicio de sesión (${res.status})`);
  }

  return res.json();
};


//export const registrarUsuario = async (nombre, email, contrasena) => {
  //const res = await fetch(`${API_URL_USUARIOS}/registro`, {
    //method: "POST",
    //headers: { "Content-Type": "application/json" },
    //body: JSON.stringify({ nombre, email, contrasena }),
  //});
  //return res.json();
//};

/* ============================
   PEDIDOS
============================ */
export const crearPedido = async (data) => {
  const res = await fetch(API_URL_PEDIDOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.mensaje || "Error al crear el pedido");
  }

  return payload;
};

export const obtenerMisPedidos = async () => {
  const res = await fetch(`${API_URL_PEDIDOS}/mis-pedidos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getPedidos = async () => {
  const res = await fetch(API_URL_PEDIDOS, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

export const listarTodosPedidos = async () => {
  const res = await fetch(API_URL_PEDIDOS, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

export const actualizarEstadoPedido = async (id, estado) => {
  const res = await fetch(`${API_URL_PEDIDOS}/${id}/estado`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ estado }),
  });
  return res.json();
};

export const eliminarPedido = async (pedidoId) => {
  const res = await fetch(`${API_URL_PEDIDOS}/${pedidoId}`, {  // ✅ CORRECTO
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Error al eliminar pedido');
  }

  return res.json();
};

export const eliminarTodosPedidos = async () => {
  const res = await fetch(`${API_URL_PEDIDOS}/todos`, {  // ✅ Cambié de "/" a "/todos"
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('Error al eliminar todos los pedidos');
  }

  return res.json();
};
/* ============================
   HORARIOS
============================ */
export const obtenerConfiguracionHorarios = async () => {
  const res = await fetch(`${API_URL_HORARIOS}/configuracion`);
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
  return res.json();
};
// ============================
//   PUBLICIDAD (GET público)
// ============================
export const getPublicidad = async () => {
  try {
    const res = await fetch("/api/publicidad");

    if (!res.ok) {
      console.warn("⚠ Error al obtener publicidad:", res.status);
      return { imagenUrl: null, activo: false };
    }

    return res.json();
  } catch (error) {
    console.error("⚠ Error fetch publicidad:", error);
    return { imagenUrl: null, activo: false };
  }
};


export const actualizarPublicidad = async (data) => {
  const token = getToken();

  if (!token) {
    throw new Error("No hay token de administrador");
  }

  const res = await fetch("/api/publicidad", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 👈 AHORA SEGURÍSIMO
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("No autorizado. Inicia sesión nuevamente.");
    }
    throw new Error("Error al actualizar publicidad");
  }

  return res.json();
};

// ============================
//  envios
// ============================
export const getEnvioConfig = async () => {
  const res = await fetch(`${BASE}/configuracion`);
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.mensaje || "Error al obtener configuración de envío");
  }

  return payload;
};

export const updateEnvioConfig = async (data) => {
  const res = await fetch("/api/horarios/configuracion", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
// ==================== CONFIGURACIÓN INCENTIVO ====================
export const getConfigIncentivo = async () => {
  const res = await fetch(`${BASE}/configuracion/incentivo`);
  if (!res.ok) throw new Error("Error al obtener config de incentivo");
  return res.json();
};

export const updateConfigIncentivo = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/configuracion/incentivo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar config de incentivo");
  return res.json();
};
