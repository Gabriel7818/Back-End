const Sequelize = require('sequelize');
const db = require('../database/db');


const User = db.define('users',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,


    },
    name:{
        type: Sequelize.STRING(50),
        allowNull: false,

    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,

    },
    gender:{
        type: Sequelize.STRING(1),
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

//criar tabela com sequelize_scope_error_default
// User.sync();
//excluir a tabela e criar novamente
//User.sync({force:true});
//verificar se algum diferença na tabela , realiza alteracao
// User.sync({alter: true});
//cadastrar registro no banco de dados

module.exports = User;