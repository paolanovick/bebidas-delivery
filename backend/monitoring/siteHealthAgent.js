const DEFAULT_BASE_URL = "https://www.eldanes.online";
const IMAGE_CHECK_LIMIT = Number(process.env.MONITOR_IMAGE_LIMIT || 12);

const buildUrl = (baseUrl, pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("data:")) return null;
  return new URL(pathOrUrl, baseUrl).toString();
};

const fetchWithTimeout = async (url, options = {}) => {
  const timeoutMs = Number(process.env.MONITOR_TIMEOUT_MS || 10000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const checkStatus = async (url, label) => {
  const response = await fetchWithTimeout(url, {
    headers: { "User-Agent": "eldanes-monitor/1.0" },
  });

  if (!response.ok) {
    throw new Error(`${label} respondio HTTP ${response.status}`);
  }

  return response;
};

const checkImage = async (baseUrl, imageUrl, productName) => {
  const url = buildUrl(baseUrl, imageUrl);
  if (!url) return null;

  let response = await fetchWithTimeout(url, {
    method: "HEAD",
    headers: { "User-Agent": "eldanes-monitor/1.0" },
  });

  if (response.status === 405 || response.status === 403) {
    response = await fetchWithTimeout(url, {
      method: "GET",
      headers: { "User-Agent": "eldanes-monitor/1.0" },
    });
  }

  if (!response.ok) {
    return `${productName}: imagen rota (${response.status}) ${url}`;
  }

  return null;
};

export const runSiteHealthAgent = async () => {
  const baseUrl = process.env.MONITOR_BASE_URL || DEFAULT_BASE_URL;
  const issues = [];

  try {
    const htmlResponse = await checkStatus(baseUrl, "Home");
    const html = await htmlResponse.text();

    if (!html.includes("static/js/main")) {
      issues.push("El HTML principal no referencia el bundle JS esperado.");
    }
  } catch (error) {
    issues.push(`Home no disponible: ${error.message}`);
  }

  try {
    await checkStatus(`${baseUrl}/api`, "API");
  } catch (error) {
    issues.push(`API no disponible: ${error.message}`);
  }

  let bebidas = [];
  try {
    const response = await checkStatus(`${baseUrl}/api/bebidas`, "Bebidas");
    bebidas = await response.json();

    if (!Array.isArray(bebidas)) {
      issues.push("La API de bebidas no devolvio un listado.");
      bebidas = [];
    } else if (bebidas.length === 0) {
      issues.push("La API de bebidas devolvio 0 productos.");
    }
  } catch (error) {
    issues.push(`No se pudo leer /api/bebidas: ${error.message}`);
  }

  const productosConImagen = bebidas
    .filter((bebida) => bebida?.imagen)
    .slice(0, IMAGE_CHECK_LIMIT);

  const imageResults = await Promise.allSettled(
    productosConImagen.map((bebida) =>
      checkImage(baseUrl, bebida.imagen, bebida.nombre || bebida._id)
    )
  );

  imageResults.forEach((result) => {
    if (result.status === "rejected") {
      issues.push(`No se pudo validar una imagen: ${result.reason.message}`);
      return;
    }

    if (result.value) {
      issues.push(result.value);
    }
  });

  return {
    name: "site-health-agent",
    ok: issues.length === 0,
    issues,
  };
};
