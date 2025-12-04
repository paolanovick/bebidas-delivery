import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./backend/config/db.js";

// === RUTAS BACKEND ===
import bebidasRoutes from "./backend/routes/bebidasRoutes.js";
import usuariosRoutes from "./backend/routes/usuariosRoutes.js";
import pedidosRoutes from "./backend/routes/pedidosRoutes.js";
import horariosRoutes from "./backend/routes/horariosRoutes.js";
import geoRouter from "./backend/routes/geo.js";
import migracionRoutes from "./backend/routes/migrar.js";
import publicidadRoutes from "./backend/routes/publicidadRoutes.js";

dotenv.config();
conectarDB();

const app = express();

// ================= CORS ===================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.includes("eldanes.online")) return callback(null, true);
      if (origin.includes("localhost")) return callback(null, true);
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =============== RUTAS API ===============
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);
app.use("/api/migracion", migracionRoutes);

// 🔥 PUBLICIDAD — DEBE IR ANTES DEL FRONTEND
app.use("/api/publicidad", publicidadRoutes);

// Ruta test
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando 🚀" });
});

// ============= SERVIR FRONTEND (REACT) =============
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});


// ============= INICIAR SERVIDOR =============
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;
