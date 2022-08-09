const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.findAll = async (req, res) => {
    await Users.findAll({
        atributes: ['id', 'name', 'email', 'gender', 'password'],
        order: [['name', 'ASC']]
    }).then((Users) => {
        return res.json({
            erro: false,
            Users
    });
    }).catch((err) => {
        return res.status(404).json({
            erro: true,
            mensagem: `Erro: ${err}, Nenhum Usuário Encontrado !`
        });
    });
};

exports.findOne = async (req, res) => {
    const {id} = req.params;
    try{
        const User = await Users.findByPk(id);
        if(!User){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário Encontrado !"
            });
        };
        res.status(200).json({
            erro: false,
            User
        });
    }catch(err) {
        res.status(404).json({
            erro: true,
            mensgem: `Erro: ${err}`
        });
    };
};

exports.create = async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    await Users.create(dados)
    .then(() =>{
        return res.json({
            erro: false,
            mensgem: 'Usuário Cadastrado com Sucesso !'
        });
    }).catch(err => {
        return res.status(400).json({
            erro: true,
            mensgem: `Erro:${err}, Usuário Não Cadastrado !`
        });
    });
};

exports.update = async (req, res) => {
    const { id } = req.body;
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário Alterado com Sucesso !'
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não Alterado ...${err}`
        });
    });
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
};

exports.login = async (req, res) => {
    await sleep(3000)
    function sleep(ms){
        return new Promise( (resolve) =>{
            setTimeout(resolve,ms)
        })
    }

    const user = await Users.findOne({
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
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha incorreta!!!"
        })
    }

    var token = jwt.sign({id: user.id}, process.env.SECRET, {
        expiresIn: 600,
    });

    return res.json({
        erro:false,
        mensagem: "Login realizado com sucesso!!!",
        token
    })
};


exports.password = async (req, res) => {
    const {id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);

    const users = await Users.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário encontrado!"
            })
    }
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
};