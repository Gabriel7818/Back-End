const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'senac'
});

connection.connect(function (err) {
    console.log("Conexão com o Database Realizada com Sucesso !");
    console.log(`Conexão ${connection.threadId}`);
    if (err) {
        console.log(`Erro: ${err}`); // Caso não conectar
    }
});

connection.query('SELECT * FROM users', function(err, rows, fields) {
    if (!err){
        console.log('Resultado de Busca: ', rows);
    } else {
        console.log(`Erro de Consulta: ${err}`); // Caso não puxar o usuário
    }
});

//Cadastrar novo registro no banco de dados
connection.query("INSERT INTO users (name, email, gender) VALUES ('Aluna', 'email@gmail.com', 'F')",
 (err, result) => {
     if (!err){
         console.log("Usuário Cadastrado com Sucesso !");
     } else {
         console.log(`Erro de Cadastro de Usuário: ${err}`);
     }
 }
)
