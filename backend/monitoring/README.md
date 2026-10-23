# Monitoreo El Danes

Este módulo incluye controles de API, compra simulada y navegador:

- `site-health-agent`: revisa home, API, listado de bebidas e imagenes.
- `purchase-flow-agent`: valida una compra en modo `dryRun`, sin crear pedido real ni descontar stock.
- `browser-ui-agent`: abre tienda y admin en Chromium, verifica que carguen productos y que el scroll no salte al achicarse el encabezado. Usa un token de interfaz sin credenciales reales y no modifica datos.

El control diario corre en el servidor con `eldanes-monitor.timer` a las 09:17 y 21:17 de Argentina (UTC-3). Intenta enviar un correo a `info@concodigoart.com` si falla algún control. El timer no requiere que esta conversación siga abierta.

GitHub Actions repite la comprobación pública y del scroll en ese horario. Si falla, abre o actualiza un issue asignado a `paolanovick`, que genera una notificación de GitHub. El correo directo depende de que SendGrid tenga créditos disponibles.

Variables necesarias:

- `BREVO_API_KEY`: API key de Brevo para enviar emails.
- `BREVO_FROM_EMAIL`: remitente validado en Brevo.
- `MONITOR_ALERT_EMAIL`: destino de alertas. Por defecto `info@concodigoart.com`.
- `MONITOR_TOKEN`: token compartido entre monitor y backend para validar compras dry-run.
- `MONITOR_BASE_URL`: sitio a monitorear. Por defecto `https://www.eldanes.online`.
- `SENDGRID_API_KEY`: clave existente en el servidor para el control diario.
- `MONITOR_FROM_EMAIL`: remitente verificado en SendGrid (puede usarse `BREVO_FROM_EMAIL`).

Comandos:

```bash
npm run monitor:once
npm run monitor
npm run monitor:ui
npm run monitor:daily
```
