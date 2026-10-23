import dotenv from "dotenv";
import { runSiteHealthAgent } from "./siteHealthAgent.js";
import { runPurchaseFlowAgent } from "./purchaseFlowAgent.js";
import { runBrowserUiAgent } from "./browserUiAgent.js";
import { sendGridAlert } from "./sendGridMailer.js";

dotenv.config({ quiet: true });
dotenv.config({ path: "backend/.env", quiet: true });

const agents = [runSiteHealthAgent, runPurchaseFlowAgent, runBrowserUiAgent];
const results = await Promise.allSettled(agents.map((agent) => agent()));
const issues = results.flatMap((result, index) => {
  if (result.status === "rejected") {
    return [`${agents[index].name}: ${result.reason?.message || "error desconocido"}`];
  }
  if (result.value.ok) {
    console.log(`OK ${result.value.name}`);
    return [];
  }
  return result.value.issues.map((issue) => `${result.value.name}: ${issue}`);
});

const date = new Date().toISOString();
const baseUrl = process.env.MONITOR_BASE_URL || "https://www.eldanes.online";

if (issues.length > 0) {
  const text = [
    `El monitor encontró problemas en ${baseUrl}.`,
    `Fecha: ${date}`,
    "",
    ...issues.map((issue) => `- ${issue}`),
    "",
    "Revisar el sitio y el registro del servicio eldanes-monitor en el servidor.",
  ].join("\n");
  console.error(text);
  try {
    await sendGridAlert("[El Danés] Falla en la tienda o el admin", text);
  } catch (error) {
    console.error(`No se pudo enviar la alerta: ${error.message}`);
  }
  process.exitCode = 1;
} else if (process.env.MONITOR_TEST_ALERT === "true") {
  await sendGridAlert(
    "[El Danés] Prueba del monitor diario",
    `Las comprobaciones de tienda, admin, API y compra simulada pasaron el ${date}.`
  );
  console.log("Correo de prueba enviado.");
}
