import jwt from "jsonwebtoken";

// ===========================================
// 🔐 VERIFICAR TOKEN
// ===========================================
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no provisto" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token inválido" });
    }
    req.usuario = usuario;
    next();
  });
};

// ===========================================
// 🔐 VALIDAR ADMIN
// ===========================================
export const esAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo admin" });
  }

  next();
};

// ===========================================
// 🚀 EXPORTS
// ===========================================
export const authMiddleware = verificarToken;
export const adminMiddleware = esAdmin;

export default esAdmin;
