var funcDiscount = require("./modules/calDiscount");  // Importando de (calDiscount.js) e mudando o nome dela para (funcDiscount)

console.log("Olá Senac");  // Para mostrar no GitBash, Console ou CMD
var client = 'Senac Campinas';

console.log(`Cliente: ${client}`);

var valProduct = 100;
var valDiscount = 37;

var finalValue = funcDiscount(valProduct, valDiscount);

console.log(`Valor do Produto com Desconto: R$${finalValue}.00`);

