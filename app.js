const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Configurar cabeçalhos e CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

// Rotas
const rotaUsuario = require('./routes/rotaUsuario');
const rotaProduto = require('./routes/rotaProduto');
const rotaEntrada = require('./routes/rotaEntrada');
const rotaSaida = require('./routes/rotaSaida');
const rotaEstoque = require('./routes/rotaEstoque');

app.use('/usuario', rotaUsuario);
app.use('/produto', rotaProduto);
app.use('/entrada', rotaEntrada);
app.use('/saida', rotaSaida);
app.use('/estoque', rotaEstoque);

module.exports = app;
