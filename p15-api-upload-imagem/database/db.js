const Sequelize = require('sequelize');

const sequelize = new Sequelize('senac', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
    // dialectOptions: {
    //     ssl: {
    //         require: false,
    //         rejectUnauthorized: false
    //     }
    // }
});

sequelize.authenticate().then( () => {
    console.log('Conexão com a Database Realizada com Sucesso !');
}).catch( (err) => {
    console.log(`Erro Conexão: ${err}`);
});

module.exports = sequelize;