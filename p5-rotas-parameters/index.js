const express = require('express');

const app = express();
const port = 3333;

app.use(express.json());

const contatos = ['André', 'Willy', 'Samuel', 'Richard'];

app.get("/", (req, res) => {
    res.send("Aplicativo Iniciado !");
})

app.get("/contatos", (req, res) => {
    return res.json(contatos);
})

app.get("/users/:id", (req, res) => {
    // const {id, nome, estado} = req.params;
    // const id = req.params.id;
    const {id} = req.params;
    const {sit, vacinado} = req.query;

    return res.json({
        id,
        nome:"Theo",
        email:"theo@sp.senac.br",
        sit,
        vacinado
    })
})

app.post("/contatos", (req, res) => {
    const {nome} = req.body;
    contatos.push(nome);

    return res.json(contatos);
})

app.delete("/users/:id", (req, res) => {
    contatos.pop();
    return res.json(contatos);
})


app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}: "http://localhost:${port}"`);
})