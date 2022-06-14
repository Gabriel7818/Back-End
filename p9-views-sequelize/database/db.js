const Sequelize = require('sequelize');

const sequelize = new Sequelize('senac', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate(0).then(function() {
    console.log('Conexão com o Database Realizada com Sucesso !');
}).catch(function(err) {
    console.log(`Erro de Conexão: ${err}`);
});

module.exports = sequelize;