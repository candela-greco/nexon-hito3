require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permitir peticiones de otros orígenes
app.use(express.json()); // Parsear JSON en el body de las peticiones
app.use(morgan("dev")); // Logging de peticiones para desarrollo

// Importar rutas
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

// Usar las rutas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal!" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportamos la app para los tests
module.exports = app;