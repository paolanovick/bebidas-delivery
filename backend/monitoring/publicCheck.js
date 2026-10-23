import { runSiteHealthAgent } from "./siteHealthAgent.js";
import { runBrowserUiAgent } from "./browserUiAgent.js";

const agents = [runSiteHealthAgent, runBrowserUiAgent];
const results = await Promise.allSettled(agents.map((agent) => agent()));
const issues = results.flatMap((result, index) => {
  if (result.status === "rejected") {
    return [`${agents[index].name}: ${result.reason?.message || "error desconocido"}`];
  }
  return result.value.issues.map((issue) => `${result.value.name}: ${issue}`);
});

if (issues.length > 0) {
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log("OK tienda, API y scroll del admin.");
}
