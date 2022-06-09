const http = require('http');
const port = 3500;  // Pode colocar qualquer número de porta que não esteja em uso

const server = http.createServer((req, res) => {  // Variável para criar o Servidor
    res.end("Página Inicial do Server Node.js");
});

server.listen(port, () => {
    console.log(`Servidor Iniciado na Porta ${port}: "http://localhost:${port}"`);
});

