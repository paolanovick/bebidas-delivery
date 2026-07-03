const DEFAULT_ALERT_EMAIL = "info@concodigoart.com";

const parseRecipients = () => {
  const raw =
    process.env.MONITOR_ALERT_EMAILS ||
    process.env.MONITOR_ALERT_EMAIL ||
    DEFAULT_ALERT_EMAIL;

  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .map((email) => ({ email }));
};

export const sendBrevoAlert = async ({ subject, htmlContent, textContent }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("MONITOR: BREVO_API_KEY no configurado; no se envio email.");
    return { sent: false, reason: "missing_api_key" };
  }

  const senderEmail =
    process.env.BREVO_FROM_EMAIL ||
    process.env.MONITOR_FROM_EMAIL ||
    DEFAULT_ALERT_EMAIL;
  const senderName = process.env.BREVO_FROM_NAME || "Monitor El Danes";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: parseRecipients(),
      subject,
      htmlContent,
      textContent,
    }),
  });

  const payload = await response.text();

  if (!response.ok) {
    throw new Error(`Brevo rechazo el email (${response.status}): ${payload}`);
  }

  return { sent: true };
};
