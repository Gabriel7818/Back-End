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

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gender: {
        type: Sequelize.STRING(1),
        allowNull: true,
    }
});

// Criar a tabela com sequelize
// User.sync();

// Excluir a tabela e criar novamente
// User.sync({force: true});

// Verificar se há alguma diferença na tabela, realiza alteração
// User.sync({alter: true});

// Cadastrar registro no Banco de Dados
User.create({
    name:'Aluno',
    email:'email@example.com',
    gender:'M'
});