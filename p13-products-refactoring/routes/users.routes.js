const usersRoutes = require('express').Router();
const users = require('../controllers/users.controller');

usersRoutes.get("/all", users.findAll);

usersRoutes.get("/show/:id", users.findOne);

usersRoutes.post("/create", users.create);

usersRoutes.put("/update", users.update);

usersRoutes.delete("/delete/:id", users.delete);

module.exports = usersRoutes;