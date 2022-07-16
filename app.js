const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos');
const { application } = require('express');

// MONITORA EXECUÇÃO DAS ROTAS E DEVOLVE UM LOG NO CONSOLE
app.use(morgan('dev'));

application.use(bodyParser.urlencoded({ extended: false })); // aceita apenas dados simples
app.use(bodyParser.json()); // json de entrada do body



// CORS - especificação que faz uso de headers do HTTP para informar aos navegadores se determinado recurso pode ser ou não acessado.
app.use((req, res, next) => {

    // Controle de acesso concede permissão para todas as origens de requisições(*). 
    // Para aceitar apenas de um servidor específico, teria que colocar no lugar do asterísco
    res.header('Access-Contol-Allow-Origin', '*') 
    res.header(
        'Access-Contol-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization' 
    ); // Cabeçalhos que serão aceitos

    // Métodos aceitos para retornar
    if(req.method == 'OPTIONS'){
        res.header('Access-Contol-Allow-Methods', 'PUT', 'POST', 'DELETE', 'PATCH', 'GET');
        return res.status(200).send({});
    }

    next();
})



app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// QUANDO NÃO ENCONTRA A ROTA CHAMADA, entra nessa:
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;