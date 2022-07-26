const Sequelize = require('sequelize');
const db = require('../database/db');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gender:{
        type: Sequelize.STRING(1),
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

//Criar a tabela com sequelize
// User.sync();

//Excluir a tabela e criar novamente
//User.sync({ force: true});

//Verificar se há alguma diferença na tabela, realiza alteração
// User.sync({ alter: true});

module.exports = User;