const router = require('express').Router();

// Route In Categories
const categoriesRoutes = require('./categories.routes');
router.use('/categories', categoriesRoutes);

// Route In Products
const productsRoutes = require('./products.routes');
router.use("/products", productsRoutes)

module.exports = router;