import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./backend/config/db.js";

import bebidasRoutes from "./backend/routes/bebidasRoutes.js";
import usuariosRoutes from "./backend/routes/usuariosRoutes.js";
import pedidosRoutes from "./backend/routes/pedidosRoutes.js";
import horariosRoutes from "./backend/routes/horariosRoutes.js";
import geoRouter from "./backend/routes/geo.js";

dotenv.config();
conectarDB();

const app = express();

// ✅ CORS abierto para testing
app.use(cors());

app.use(express.json());

// Rutas API
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);

// Rutas de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Bebidas Delivery funcionando 🚀",
    endpoints: [
      "/api/bebidas",
      "/api/usuarios",
      "/api/pedidos",
      "/api/horarios",
      "/api/geo",
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// ✅ SIEMPRE escuchar en un puerto (requerido por Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// Exportar para otras plataformas (no afecta a Render)
export default app;
