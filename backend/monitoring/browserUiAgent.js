import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = process.env.MONITOR_BASE_URL || "https://www.eldanes.online";

const snapshot = (selector) => {
  const element = document.querySelector(selector);
  return {
    scrollY: window.scrollY,
    documentTop: element
      ? element.getBoundingClientRect().top + window.scrollY
      : null,
    maxScroll: document.documentElement.scrollHeight - window.innerHeight,
  };
};

const checkScroll = async (page, selector, label, issues) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  const before = await page.evaluate(snapshot, selector);

  if (before.documentTop === null || before.maxScroll < 80) {
    issues.push(`${label}: no hay contenido suficiente para comprobar el scroll.`);
    return;
  }

  await page.mouse.move(1000, 600);
  const samples = [];
  for (let i = 0; i < 5; i += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(180);
    samples.push(await page.evaluate(snapshot, selector));
  }

  const maxY = Math.max(...samples.map((sample) => sample.scrollY));
  if (maxY < Math.min(60, before.maxScroll - 10)) {
    issues.push(`${label}: la rueda no logra desplazar la página (máximo ${maxY}px).`);
  }

  const shifted = samples.some(
    (sample) => Math.abs(sample.documentTop - before.documentTop) > 5
  );
  if (shifted) {
    issues.push(`${label}: el contenido salta cuando el encabezado cambia de tamaño.`);
  }

  const lastY = samples.at(-1).scrollY;
  if (maxY > 60 && lastY < maxY - 30) {
    issues.push(`${label}: el scroll retrocede después de avanzar.`);
  }
};

export const runBrowserUiAgent = async () => {
  const issues = [];
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.MONITOR_CHROME_PATH || undefined,
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("eldanes_ingreso_tienda", "true");
      localStorage.setItem("ageVerified18", "true");
      localStorage.setItem("cookie_consent", "declined");

      // La ruta admin solo decodifica el token para mostrar la interfaz.
      // El monitor no conoce credenciales ni ejecuta operaciones protegidas.
      const payload = btoa(
        JSON.stringify({ id: "monitor-ui", rol: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })
      ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      localStorage.setItem("token", `e30.${payload}.monitor`);
    });

    const page = await context.newPage();
    page.setDefaultTimeout(25000);

    const storeResponse = await page.goto(`${BASE_URL}/tienda`, { waitUntil: "domcontentloaded" });
    if (!storeResponse?.ok()) throw new Error(`Tienda HTTP ${storeResponse?.status() || "sin respuesta"}`);
    await page.getByRole("heading", { name: "Catálogo de Bebidas" }).waitFor();
    await page.locator("[data-product-card]").first().waitFor();
    await page.waitForTimeout(1800);
    const closeAd = page.getByRole("button", { name: "Cerrar publicidad" }).first();
    if (await closeAd.isVisible().catch(() => false)) await closeAd.click();
    await checkScroll(page, "main", "Tienda", issues);

    const adminResponse = await page.goto(`${BASE_URL}/admin/bebidas-categorias`, { waitUntil: "domcontentloaded" });
    if (!adminResponse?.ok()) throw new Error(`Admin HTTP ${adminResponse?.status() || "sin respuesta"}`);
    await page.getByRole("heading", { name: "Catálogo de Bebidas" }).waitFor();
    await page.locator("table tbody tr").first().waitFor();
    await checkScroll(page, "h2", "Admin", issues);

    if (issues.length > 0) {
      await page.screenshot({ path: "monitor-ui-failure.png", fullPage: true }).catch(() => {});
    }
  } catch (error) {
    issues.push(`No se pudo completar la prueba visual: ${error.message}`);
  } finally {
    await browser?.close();
  }

  return { name: "browser-ui-agent", ok: issues.length === 0, issues };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await runBrowserUiAgent();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}
