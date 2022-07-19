const express = require('express');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const {promisify} = require('util');
require('dotenv').config();
const sendMail = require('./providers/mailProvider');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.send('Serviço API Rest iniciada...');
});

app.get("/users", validarToken, async (req, res) => {
    await User.findAll({
        attributes: ['id','name', 'email','gender'],
        order:[['name','ASC']]
    })
    .then( (users) => {
        return res.json({
            erro:false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário Encontrado !`
        });
    });
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const users = await User.findByPk(id);
        if(!users) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro, Nenhum Usuário Encontrado !"
            })
        }
        res.status(200).json({
            erro: false,
            users
        })
    }catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/user", async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    let gender = dados.gender;

    await User.create(dados)
    .then( ()=>{
        /* Enviar E-mail */
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
        /* ========== */
        sendMail(to, cc, 'Sua Conta foi Criada com Sucesso !', htmlbody);

        return res.json({
            erro: false,
            mensagem: 'Usuário Cadastrado com Sucesso !'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário Não Cadastrado... ${err}`
        })
    })
});

app.put("/user",async (req, res) => {
    const{ id} = req.body;

    await User.update(req.body,{ where: { id}})
    .then(()=>{
        return res.json({
            erro:false,
            mensagem: "Usuario Alterado com Sucesso"
        })
    }).catch((err) => {
        return res.status(400).json({
            erro:true,
            mensagem:`Erro: Usuario Não Alterado... ${err}`
        })
    })
});

app.delete("/user/:id",async (req, res)=>{
     const {id} = req.params;
     await User.destroy({where: { id}})
     .then(()=>{
         return res.json({
             erro:false,
             mensagem: "Usuario Apagado com Sucesso !"
         });
     }).catch(() => {
         return res.status(400).json({
             erro:true,
             mensagem: `Erro: ${err} Usuário Não Apagado...`
         });
     });
 });

app.post("/login", async (req, res)=>{
    const user = await User.findOne({
        attributes: ['id','name', 'email','gender','password'],
        where: {
            email: req.body.email
        }
})
if(user === null){
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário ou Senha Incorretos !"
    })
}
if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
        erro: true,
        mensagem:"Erro: Usuário ou Senha Incorretos !"
    })
}

 var token = jwt.sign({id: user.id}, process.env.SECRET,{
    expiresIn: 600 // 10 Minutos
 });

return res.json({
    erro:false,
    mensagem: "Login Realizado com Sucesso !",
    token
})
});

async function validarToken(req, res, next) {
    // return res.json({mensagem: 'É Necessário a Validação do Token !'});
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');
    if (!token){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: É Necessário o Login para Proseguir !"
        })
    };
    try{
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        req.userId = decoded.id;
        console.log(req.userId);

        return next();
    }catch(err){
        if(err){
            return res.status(400).json({
                erro:true,
                mensagem: `Erro: ${err}`
            });
        }else{
            return res.status(401).json({
                erro: true,
                mensagem: "Erro: É Necessário Realizar o Login"
            });
        };
    };
};

app.put('/user-senha', async (req, res) => {
    const {id, password} = req.body;
    var senhaCrypt= await bcrypt.hash(password, 8);

    await User.update({password: senhaCrypt}, {where: {id: id}})
    .then(()=> {
        return res.json({
            erro: false,
            mensagem:"Senha Alterada com Sucesso!"
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem:`Erro: ${err}... Senha Não Alterada`
        })
    })
});

app.listen(process.env.PORT,() => {
    console.log(`Serviço Iniciado na Porta ${process.env.PORT} "http://localhost:${process.env.PORT}"`);
});

