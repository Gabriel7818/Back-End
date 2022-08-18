const express = require('express');
var cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

// Caminho de Pasta Path
const path = require('path')
// ===================================

// ===================================
const fs = require('fs');
// ===================================

// Middleware
const { validaToken } = require('./middlewares/auth');
const upload = require('./middlewares/uploadImgUser')

// ===================================
const User = require('./models/User');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// Caminho para Pasta de Upload
app.use('/files', express.static(path.resolve(__dirname, "public", "upload")));

app.use( (req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    app.use(cors());
    next();
})

app.get("/", function (request, response) {
    response.send("Serviço API Rest iniciada...");
});

app.get("/users", validaToken, async (req, res) =>{
    await sleep(3000)
    function sleep(ms){
        return new Promise( (resolve) =>{
            setTimeout(resolve,ms)
        })
    }    
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender', 'profileImg'],
        order:[['id', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`
        })
    })


});

app.get('/user/:id', validaToken, async (req, res) => {
    const { id } = req.params;
    try {
        // await User.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
        }
        var endImagem = "http://localhost:4500/files/users/"+ users.profileImg;
        res.status(200).json({
            erro:false,
            users,
            endImagem
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/user", validaToken, async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
   
    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        let to = dados.email;
        let cc = '';
        let subject = `Sua conta foi criada com sucesso!`;

        let mailBody = userCreateMailTemplate({
            name: dados.name,
            email: dados.email,
            gender: dados.gender
        })
        sendMail(to, cc, subject , mailBody);
        /* ************* */

        return res.status(201).json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
});

app.put("/user", validaToken, async (req, res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
});

app.delete("/user/:id", validaToken, async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário deletado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
});

app.post("/login", async (req, res) => {

    // await sleep(3000)
    // function sleep(ms){
    //     return new Promise( (resolve) =>{
    //         setTimeout(resolve,ms)
    //     })
    // }


    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'gender', 'password'],
        where: {
            email: req.body.email
        }
    })
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem:"Erro: Email ou senha incorreta!!"
        })
    }
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    let token = jwt.sign({id: user.id}, process.env.SECRET, {
        expiresIn: 6000
    })

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
});

app.put('/user-senha', validaToken, async (req, res) => {
    const {id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    await User.update({password: senhaCrypt }, {where: {id: id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha edita com sucesso!"
        }); 
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}... A senha não foi alterada!!!`
        })
    })
});

app.get("/validaToken", validaToken, async (req, res) => {
    await User.findByPk(req.userId, { 
        attributes: ['id', 'name', 'email']
    }).then( (user) => {
        return res.status(200).json({
            erro: false,
            user
        });
    }).catch( () =>{
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar o login!"
        })
    })
}); 

app.put('/edit-profile-image', validaToken, upload.single('image'), async (req, res) => {
    if(req.file){
        console.log(req.file);

        await User.findByPk(req.userId)
        .then( user => {
            console.log(user);
            const imgOld = './public/upload/users/' + user.dataValues.profileImg
            
            fs.access(imgOld, (err) => {
                if(!err){
                    fs.unlink(imgOld, () => {})
                };
            });
        }).catch( () => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Perfil não Encontrado !"
            });
        });

        await User.update({profileImg: req.file.filename},
            {where: {id: req.userId}})
            .then(() => {
    return res.json({
        erro: false,
        mensagem: "Imagem Editada com Sucesso !"
    })
}).catch( (err) => {
    return res.status(400).json({
        erro: true,
        mensagem: `Erro:${err}, Imagem não Editada !`
    })
})
} else{
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Selecione uma Imagem Válida ! (.png, .jpeg, .jpg)"
    })};
});


app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT} "http://localhost:${process.env.PORT}"`);
});