import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { conectarDB } from "./config/db.js";
import bebidasRoutes from "./routes/bebidasRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import pedidosRoutes from "./routes/pedidosRoutes.js";
import horariosRoutes from "./routes/horariosRoutes.js";
import geoRouter from "./routes/geo.js";

dotenv.config();
conectarDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ RUTAS API
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);

// ✅ Ruta simple de prueba
app.get("/api", (req, res) => {
  res.send("API de Bebidas Delivery funcionando 🚀");
});

// ✅ Configurar __dirname (porque usamos ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Servir frontend en producción (Render)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
