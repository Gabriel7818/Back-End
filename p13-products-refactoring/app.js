const express = require('express');
const app = express();
require('dotenv').config();
// const Categories = require('./models/Categories');
// const Products = require('./models/Products');
// const Users = require('./models/Users');
const router = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send('Serviço de API iniciada...');
})

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT} "http://localhost:${process.env.PORT}"`);
}); 