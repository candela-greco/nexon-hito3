const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/auth");

// Ruta pública: obtener todos los productos
router.get("/", productController.getAllProducts);

// Ruta protegida: crear un producto (solo usuarios autenticados)
router.post("/", verifyToken, productController.createProduct);

module.exports = router;
