import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sendBrevoAlert } from "./brevoMailer.js";
import { runSiteHealthAgent } from "./siteHealthAgent.js";
import { runPurchaseFlowAgent } from "./purchaseFlowAgent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(rootDir, ".env"), quiet: true });
dotenv.config({ path: path.join(rootDir, "backend", ".env"), quiet: true });

const statePath = process.env.MONITOR_STATE_FILE
  ? path.resolve(process.env.MONITOR_STATE_FILE)
  : path.join(__dirname, ".monitor-state.json");

const INTERVAL_MS = Number(process.env.MONITOR_INTERVAL_MS || 5 * 60 * 1000);
const REPEAT_ALERT_MS = Number(
  process.env.MONITOR_REPEAT_ALERT_MS || 6 * 60 * 60 * 1000
);

const agents = [runSiteHealthAgent, runPurchaseFlowAgent];

const readState = () => {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return {};
  }
};

const writeState = (state) => {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
};

const htmlEscape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildAlert = (result) => {
  const baseUrl = process.env.MONITOR_BASE_URL || "https://www.eldanes.online";
  const timestamp = new Date().toISOString();
  const lines = [
    `Agente: ${result.name}`,
    `Fecha: ${timestamp}`,
    `Sitio: ${baseUrl}`,
    "",
    "Problemas:",
    ...result.issues.map((issue) => `- ${issue}`),
  ];

  return {
    subject: `[El Danes Monitor] Falla en ${result.name}`,
    textContent: lines.join("\n"),
    htmlContent: `
      <h2>Falla detectada en El Danes</h2>
      <p><strong>Agente:</strong> ${htmlEscape(result.name)}</p>
      <p><strong>Fecha:</strong> ${htmlEscape(timestamp)}</p>
      <p><strong>Sitio:</strong> ${htmlEscape(baseUrl)}</p>
      <ul>
        ${result.issues.map((issue) => `<li>${htmlEscape(issue)}</li>`).join("")}
      </ul>
    `,
  };
};

const shouldAlert = (state, result) => {
  const signature = result.issues.join("|");
  const previous = state[result.name];
  const now = Date.now();

  if (!previous) return true;
  if (previous.signature !== signature) return true;
  return now - Number(previous.lastAlertAt || 0) >= REPEAT_ALERT_MS;
};

const runAllAgents = async () => {
  const settledResults = await Promise.allSettled(agents.map((agent) => agent()));
  const state = readState();
  const now = Date.now();

  for (const settled of settledResults) {
    const result =
      settled.status === "fulfilled"
        ? settled.value
        : {
            name: "monitor-runner",
            ok: false,
            issues: [settled.reason?.message || "Fallo desconocido"],
          };

    if (result.ok) {
      if (state[result.name]?.status === "failing") {
        console.log(`MONITOR: ${result.name} recuperado.`);
      }
      state[result.name] = {
        status: "ok",
        signature: "",
        lastOkAt: now,
        lastAlertAt: state[result.name]?.lastAlertAt || 0,
      };
      continue;
    }

    console.error(`MONITOR: ${result.name} fallo: ${result.issues.join("; ")}`);

    if (shouldAlert(state, result)) {
      const alert = buildAlert(result);
      try {
        await sendBrevoAlert(alert);
      } catch (error) {
        console.error(`MONITOR: no se pudo enviar alerta Brevo: ${error.message}`);
      }
      state[result.name] = {
        status: "failing",
        signature: result.issues.join("|"),
        lastAlertAt: now,
        lastFailureAt: now,
      };
    } else {
      state[result.name] = {
        ...state[result.name],
        status: "failing",
        lastFailureAt: now,
      };
    }
  }

  writeState(state);
};

const runLoop = async () => {
  await runAllAgents();

  if (process.argv.includes("--once")) {
    return;
  }

  setInterval(() => {
    runAllAgents().catch((error) => {
      console.error("MONITOR: error general", error);
    });
  }, INTERVAL_MS);
};

runLoop().catch((error) => {
  console.error("MONITOR: no pudo iniciar", error);
  process.exit(1);
});
