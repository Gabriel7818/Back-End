const Products = require('../models/Products')

exports.findAll = async (req, res) => {
    await Products.findAll({
        atributes: ['id', 'name', 'description', 'quantity', 'price', 'categorieId'],
        order: [['name', 'ASC']]
    }).then((Products) => {
        return res.json({
            erro: false,
            Products
    });
    }).catch((err) => {
        return res.status(404).json({
            erro: true,
            mensagem: `Erro: ${err}, Nenhum Produto Encontrado !`
        });
    });
};

exports.findOne = async (req, res) => {
    const {id} = req.params;
    try{
        const Products = await Users.findByPk(id);
        if(!Products){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum Produto Encontrado !"
            });
        };
        res.status(200).json({
            erro: false,
            Products
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
    await Products.create(dados)
    .then(() =>{
        return res.json({
            erro: false,
            mensgem: 'Produto Cadastrado com Sucesso !'
        });
    }).catch(err => {
        return res.status(400).json({
            erro: true,
            mensgem: `Erro:${err}, Produto Não Cadastrado !`
        });
    });
};

exports.update = async (req, res) => {
    const {id} = req.body;
    await Products.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Produto Alterado com Sucesso !'
        })
    }).catch((err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Produto não Alterado !`
        });
    });
};

exports.delete = async (req, res) => {
    const {id} = req.params;
    await Products.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Produto Apagado com Sucesso !'
        })
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Produto não apagado !`
        });
    });
};