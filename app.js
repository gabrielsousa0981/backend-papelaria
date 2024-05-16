const express = require('express');

const app = express();

const usuario = [
    { nome: "junior", idade: 20, peso: 50 },
    { nome: "hugo", idade: 30 },
    { nome: "victor", idade: 18, peso: 75, cep: "77807060" }
];

app.use("/todos", (req, res, next) => {
    res.send(usuario);
});

app.use("/nome", (req, res, next) => {
    res.send(usuario[1].nome);
});

app.use("/cep", (req, res, next) => {
    res.send(usuario[2].cep);
});

app.use("/soma", (req, res, next) => {
    
    let somaIdades = 0;
    usuario.forEach(user => {
        if (user.idade) {
            somaIdades += parseInt(user.idade);
        }
    });
    res.send(`A soma das idades é: ${somaIdades}`);
});

module.exports = app;
