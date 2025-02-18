const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware para proteger rutas que requieren autenticación
const verifyToken = (req, res, next) => {
  // Se espera que el token venga en el header "Authorization" en formato "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Acceso denegado" });
  }
  // Extraer el token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  try {
    // Verificar el token y obtener la información del usuario
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Agregar la información del token a req.user
    next();
  } catch (err) {
    res.status(400).json({ error: "Token no es válido" });
  }
};

module.exports = verifyToken;
