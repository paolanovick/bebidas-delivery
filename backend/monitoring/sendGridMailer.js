const recipients = () =>
  (process.env.MONITOR_ALERT_EMAILS || process.env.MONITOR_ALERT_EMAIL || "info@concodigoart.com")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)
    .map((email) => ({ email }));

export const sendGridAlert = async (subject, text) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.MONITOR_FROM_EMAIL || process.env.BREVO_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    throw new Error("Falta SENDGRID_API_KEY o MONITOR_FROM_EMAIL.");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients() }],
      from: { email: fromEmail, name: "Monitor El Danés" },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`SendGrid rechazó la alerta (${response.status}): ${detail}`);
  }
};
