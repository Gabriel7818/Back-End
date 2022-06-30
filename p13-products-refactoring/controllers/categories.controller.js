const Categories = require('../models/Categories')

exports.findAll = async (req, res) => {
    await Categories.findAll({
        atributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']]
    }).then((Categories) => {
        return res.json({
            erro: false,
            Categories
    });
    }).catch((err) => {
        return res.status(404).json({
            erro: true,
            mensagem: `Erro: ${err}, Nenhuma Categoria Encontrada !`
        });
    });
};

exports.findOne = async (req, res) => {
    const {id} = req.params;
    try{
        const Categories = await User.findByPk(id);
        if(!Categories){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhuma Categoria Encontrada !"
            });
        };
        res.status(200).json({
            erro: false,
            Categories
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
    await Categories.create(dados)
    .then(() =>{
        return res.json({
            erro: false,
            mensgem: 'Categoria Cadastrada com Sucesso !'
        });
    }).catch(err => {
        return res.status(400).json({
            erro: true,
            mensgem: `Erro:${err}, Categoria Não Cadastrada !`
        });
    });
};

exports.update = async (req, res) => {
    const {id} = req.body;
    await Categories.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Categoria Alterada com Sucesso !'
        })
    }).catch((err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Categoria não Alterada`
        });
    });
};

exports.delete = async (req, res) => {
    const {id} = req.params;
    await Categories.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: 'Categoria Apagada com Sucesso !'
        })
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro:${err}, Categoria não apagada !`
        });
    });
};

// exports.findAll()