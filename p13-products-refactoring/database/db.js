const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    })

sequelize.authenticate(0).then(function() {
    console.log('Conexão com o Database Realizada com sucesso.');
}).catch(function(err) {
    console.log(`Não Foi Possível se Conectar ao Database: ${err}`);
});

module.exports = sequelize; 

