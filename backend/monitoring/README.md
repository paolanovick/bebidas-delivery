# Monitoreo El Danes

Este modulo corre dos agentes:

- `site-health-agent`: revisa home, API, listado de bebidas e imagenes.
- `purchase-flow-agent`: valida una compra en modo `dryRun`, sin crear pedido real ni descontar stock.

Variables necesarias:

- `BREVO_API_KEY`: API key de Brevo para enviar emails.
- `BREVO_FROM_EMAIL`: remitente validado en Brevo.
- `MONITOR_ALERT_EMAIL`: destino de alertas. Por defecto `info@concodigoart.com`.
- `MONITOR_TOKEN`: token compartido entre monitor y backend para validar compras dry-run.
- `MONITOR_BASE_URL`: sitio a monitorear. Por defecto `https://www.eldanes.online`.

Comandos:

```bash
npm run monitor:once
npm run monitor
```
