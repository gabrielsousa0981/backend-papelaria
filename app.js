const express = require('express');
const app = express();

const cep = [
    {
        "cep": "01001-000",
        "logradouro": "Praça da Sé",
        "complemento": "lado ímpar",
        "bairro": "Sé",
        "localidade": "São Paulo",
        "uf": "SP",
        "ibge": "3550308",
        "gia": "1004",
        "ddd": "11",
        "siafi": "7107"
    },
    {
        "cep": "77814-790",
        "logradouro": "Rua 20",
        "complemento": "",
        "bairro": "Loteamento Monte Sinai",
        "localidade": "Araguaína",
        "uf": "TO",
        "ibge": "1702109",
        "gia": "",
        "ddd": "63",
        "siafi": "9241"
    },
    {
        "cep": "77825-769",
        "logradouro": "Rua dos Avelos",
        "complemento": "",
        "bairro": "Residencial Topázio",
        "localidade": "Araguaína",
        "uf": "TO",
        "ibge": "1702109",
        "gia": "",
        "ddd": "63",
        "siafi": "9241"
    }
];

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

app.use("/cep/:valor", (req, res, next) => {
    const valor = req.params.valor;
    const cepData = cep.find(entry => entry.cep === valor);
    if (cepData) {
        res.send(cepData);
    } else {
        res.status(404).send({ error: "CEP não encontrado" });
    }
});

app.use("/viacep/:valor", (req, res, next) => {

    const valor=req.params.valor;

    const resultado="";

fetch ("https://viacep.com.br/ws/"+valor+"/json")
.then(resposta=>{
    console.log(resposta.data)
})








})






app.use("/soma", (req, res, next) => {
    let somaIdades = 0;
    usuario.forEach(user => {
        if (user.idade) {
            somaIdades += parseInt(user.idade);
        }
    });
    res.send(`Soma total: ${somaIdades}`);
});

module.exports = app;
