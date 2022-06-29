const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const User = require('./database/models/User');
require('dotenv').config();
const sendMail = require('./providers/mailProvider')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.send("Serviço da API Rest iniciada...");
});

app.get("/users", async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender', 'password'],
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

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    let gender = dados.gender;

    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += '<div style="background-color:#000; margin-bottom:150px;">';
        htmlbody += '<div style="margin-top:150px;">';
        htmlbody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
        htmlbody += 'Olá {name},';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
        htmlbody += 'Sua conta foi criada com sucesso!';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Seu login é o seu email: {email}';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Sexo: {gender}';
        htmlbody += '</p>';
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{name}', name);
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{gender}', gender);
        /* ************* */
        sendMail(to, cc, 'Sua conta foi criada com sucesso!', htmlbody);

        return res.json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
})

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

app.delete("/user/:id", async (req, res) => {
    const {id} = req.params;
    await User.destroy({where:{id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário Deletado com Sucesso !"
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}, Usuário não Deletado`
        });
    });
});

app.get('/user-senha', async (req,res) => {
    const {id, password} = req.body;
    var senhaCrypt = await bycrypt.hash(password, 8);
    
    await User.update({password: senhaCrypt}, {where: {id: id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha Editada com Sucesso !"
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}. A Senha não Foi Alterada !`
        });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta: ${process.env.PORT}: "http://localhost:${process.env.PORT}"`);
});