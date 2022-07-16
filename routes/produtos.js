const express = require('express');
const router = express.Router();


// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'Usando GET dentro da roda de produtos'
    });
});

// INSERE UM PRODUTO
router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando POST dentro da rota de produtos'
    });
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if(id === "1"){
        res.status(200).send({
            mensagem: 'Você passou o id 1',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'Usando GET com algum produto !== 1'
        });
    }
});

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando PATCH dentro da rota de produtos',
        id: id
    });
});

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'Usando DELETE dentro da rota de produtos',
        id: id
    });
});

module.exports = router;