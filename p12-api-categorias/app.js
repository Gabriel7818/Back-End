const express = require('express');
const app = express();
require('dotenv').config();
const Categories = require('./models/Categories');
const Products = require('./models/Products');

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.get("/", function (request, response) {
    response.send("Serviço API Rest iniciada...");
})

app.get("/categories", async (req, res) =>{
    await Categories.findAll({
        attributes: ['id', 'name', 'description'],
        order:[['name', 'ASC']]
    })
    .then( (categories) =>{
        return res.json({
            erro: false,
            categories
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou Nenhuma Categoria encontrado!!!`
        })
    })


})

app.get('/categorie/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // await Categories.findAll({ where: {id: id}})
        const categories = await Categories.findByPk(id);
        if(!categories){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhuma Categoria encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            categories
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/categorie", async (req, res) => {

    var dados = req.body;

    await Categories.create(dados)
    .then( ()=>{
        return res.json({
            erro: false,
            mensagem: 'Categoria cadastrada com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Categoria não cadastrada... ${err}`
        })
    })
})

app.put("/categorie", async (req, res) => {
    const { id } = req.body;

    await Categories.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Categoria alterada com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Categoria não alterada ...${err}`
        })
    })
})

app.delete("/categorie/:id", async (req, res) => {
    const { id } = req.params;
    await Categories.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Categoria apagada com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Categoria não apagada...`
        });
    });
});



app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});