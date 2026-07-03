const DEFAULT_BASE_URL = "https://www.eldanes.online";

const fetchJson = async (url, options = {}) => {
  const timeoutMs = Number(process.env.MONITOR_TIMEOUT_MS || 10000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    return { response, payload };
  } finally {
    clearTimeout(timer);
  }
};

const elegirProducto = (bebidas) =>
  bebidas.find((bebida) => bebida?._id && Number(bebida.precio) > 0) || null;

export const runPurchaseFlowAgent = async () => {
  const baseUrl = process.env.MONITOR_BASE_URL || DEFAULT_BASE_URL;
  const issues = [];

  if (!process.env.MONITOR_TOKEN) {
    return {
      name: "purchase-flow-agent",
      ok: false,
      issues: ["MONITOR_TOKEN no esta configurado; no se puede probar compra."],
    };
  }

  let producto = null;

  try {
    const { response, payload } = await fetchJson(`${baseUrl}/api/bebidas`, {
      headers: { "User-Agent": "eldanes-monitor/1.0" },
    });

    if (!response.ok || !Array.isArray(payload)) {
      issues.push(`No se pudo leer productos para compra: HTTP ${response.status}`);
    } else {
      producto = elegirProducto(payload);
    }
  } catch (error) {
    issues.push(`Error leyendo productos para compra: ${error.message}`);
  }

  if (!producto) {
    issues.push("No hay producto valido para simular compra.");
  }

  if (issues.length === 0) {
    try {
      const { response, payload } = await fetchJson(`${baseUrl}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "eldanes-monitor/1.0",
        },
        body: JSON.stringify({
          dryRun: true,
          monitorToken: process.env.MONITOR_TOKEN,
          emailCliente: "monitor@concodigoart.com",
          telefono: "0000000000",
          modoEntrega: "envio",
          direccionEntrega: "Monitor automatico sin entrega real",
          notas: "[MONITOR] Validacion dry-run de compra",
          items: [
            {
              bebida: producto._id,
              nombre: producto.nombre,
              precio: Number(producto.precio) || 0,
              cantidad: 1,
              origenCarrito: "tienda",
              ventaSinControlStock: true,
            },
          ],
        }),
      });

      if (!response.ok || payload?.dryRun !== true) {
        issues.push(
          `La validacion de compra fallo: HTTP ${response.status} ${
            payload?.mensaje || ""
          }`.trim()
        );
      }
    } catch (error) {
      issues.push(`Error probando flujo de compra: ${error.message}`);
    }
  }

  return {
    name: "purchase-flow-agent",
    ok: issues.length === 0,
    issues,
  };
};
