const categoriesRoutes = require('express').Router();
const categories = require('../controllers/categories.controller');

categoriesRoutes.get("/all", categories.findAll);

categoriesRoutes.get("/show/:id", categories.findOne);

categoriesRoutes.post("/create", categories.create);

categoriesRoutes.put("/update", categories.update);

categoriesRoutes.delete("/delete/:id", categories.delete);

module.exports = categoriesRoutes; 