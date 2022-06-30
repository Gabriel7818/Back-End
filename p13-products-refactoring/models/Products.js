const Sequelize = require('sequelize');
const db = require('../database/db');
const Categories = require('./Categories');

const Products = db.define('products', {
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
    description: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    price: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
    }
})

Products.belongsTo(Categories, {
    constraint: true,
    foreignKey: 'categorieId'
})

//Criar a tabela com sequelize
// Products.sync();

//Excluir a tabela e criar novamente
//Products.sync({ force: true});

//Verificar se há alguma diferença na tabela, realiza alteração
// Products.sync({ alter: true});

module.exports = Products;