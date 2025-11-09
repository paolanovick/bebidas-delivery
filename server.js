import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./backend/config/db.js";

import bebidasRoutes from "./backend/routes/bebidasRoutes.js";
import usuariosRoutes from "./backend/routes/usuariosRoutes.js";
import pedidosRoutes from "./backend/routes/pedidosRoutes.js";
import horariosRoutes from "./backend/routes/horariosRoutes.js";
import geoRouter from "./backend/routes/geo.js";

import Bebida from "./backend/models/Bebida.js"; // ✅ RUTA CORRECTA

dotenv.config();
conectarDB();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ CARGA AUTOMÁTICA INICIAL DE BEBIDAS (TEMPORAL)
async function cargarDatosIniciales() {
  try {
    const count = await Bebida.countDocuments();
    if (count > 0) {
      console.log("✅ La colección 'bebidas' ya tiene datos");
      return;
    }

    await Bebida.insertMany([
      {
        nombre: "Coca Cola 1.5L",
        descripcion: "Gaseosa sabor cola",
        precio: 1200,
        stock: 50,
        imagen: "https://i.imgur.com/2VGwUYI.png",
        categoria: "Mayoristas",
      },
      {
        nombre: "Pepsi 1.5L",
        descripcion: "Gaseosa Pepsi original",
        precio: 1100,
        stock: 40,
        imagen: "https://i.imgur.com/pQNxYI7.png",
        categoria: "Mayoristas",
      },
      {
        nombre: "Fernet Branca 750ml",
        descripcion: "Clásico argentino",
        precio: 5600,
        stock: 20,
        imagen: "https://i.imgur.com/3UXtXzX.png",
        categoria: "Aperitivos",
      },
      {
        nombre: "Cerveza Quilmes 1L",
        descripcion: "Rubia clásica",
        precio: 900,
        stock: 70,
        imagen: "https://i.imgur.com/xpCY8kw.png",
        categoria: "Cervezas",
      },
    ]);

    console.log("✅ Datos iniciales CARGADOS en MongoDB");
  } catch (error) {
    console.error("❌ Error cargando datos iniciales:", error);
  }
}

cargarDatosIniciales(); // ✅ Se ejecuta al iniciar el servidor

// Rutas
app.use("/api/bebidas", bebidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/geo", geoRouter);

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;
