const Products = require('../models/Users');


exports.findAll = async (req, res) => {
    await Products.findAll({
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
        const Users = await User.findByPk(id);
        if(!Users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Usuário Encontrado !"
            });
        };
        res.status(200).json({
            erro: false,
            Users
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
    const {id} = req.body;
    await Users.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Usuário Alterado com Sucesso !'
        })
    }).catch((err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Usuário não Alterado !`
        });
    });
};

exports.delete = async (req, res) => {
    const {id} = req.params;
    await Users.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Usuário Apagado com Sucesso !'
        })
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Usuário não apagado !`
        });
    });
};