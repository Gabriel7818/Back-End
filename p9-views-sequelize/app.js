const express = require('express');
const {engine} = require('express-handlebars');
const app = express();

const User = require('./database/models/User');
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('list-users');
});

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/add-user', async (req, res) => {
    var dados = req.body;
    await User.create(dados)
    .then( () => {
        // return res.json({
        //     mensagem: "Usuário Cadastrado com Sucesso !"
        // })
        res.redirect('/');
    }).catch ((err) =>{
        return res.status(400).json({
            mensagem: `Erro: Usuário Não Cadastrado - ${err}`
        });
    });
})

app.listen(3333);