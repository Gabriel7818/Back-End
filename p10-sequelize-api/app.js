const express = require('express');
const app = express();
const port = 4500;
const User = require('./database/models/User');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", function(request, response) {
    response.send("Serviço da API Rest iniciada...");
});

app.get("/users", async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender'],
        order:[['name', 'ASC']]
    }).then((users) => {
        return res.json({
            erro: false,
            users
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário Encontrado`
        });
    });
});

app.get('/users/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário Encontrado"
            });
        };
        res.status(200).json({
            erro: false,
            users
        });
    }catch(err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        });
    };
});

app.post("/user", async (req, res) => {
    // const {name, email, gender, password} = req.body;
    await User.create(req.body)
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Usuário Cadastrado com Sucesso !'
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não Cadastrado ${err}`
        });
    });
});

app.put("/user", async (req, res) => {
    const {id} = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Usuário Alterado com Sucesso !'
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não Alterado ${err}`
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}: "http://localhost:${port}"`);
});