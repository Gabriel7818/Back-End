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
    console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch( (err) => {
    console.log(`Erro Conexão: ${err}`);
})

module.exports = sequelize;