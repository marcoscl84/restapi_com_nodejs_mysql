const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer'); // middleware for handling multipart/form-data , which is primarily used for uploading files

// DEFINIÇÃO NOVO NOME ARQUIVO PARA O UPLOAD COM A EXTENSÃO E O DESTINO
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ 
    storage: storage
    limits: {
        fileSize: 1024 * 1024 * 5 //limita tamanho img a 5mb
    },
    fileFilter: fileFilter
});*/
//const upload = multer({ storage: storage });
const upload = multer({ dest: 'uploads/' });

// RETORNA TODOS OS PRODUTOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query('SELECT * FROM produtos', (error, result, fields) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        const response = {
            quantidade: result.length,
            produtos: result.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem_produto: prod.imagem_produto,
                    request: {
                    tipo: 'GET',
                    descricao: `Retorna os dados do produto => ${prod.id_produto}`,
                    URL: 'http://localhost:3001/produtos/' + prod.id_produto
                    }
                }
            })
        }

        return res.status(200).send({ response })
        })
    })
})

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
        'SELECT * FROM produtos WHERE id_produto = ?',
        [req.params.id_produto],
        (error, result, fields) => {
            if (error) {
                return res.status(500).send({ error: error })
            }

            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado produto com este ID'
                })
            }

            const response = {
                produto: {
                    id_produto: result[0].id_produto,
                    nome: result[0].nome,
                    preco: result[0].preco,
                    imagem_produto: result[0].imagem_produto,
                    request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um produto específico',
                    URL: 'http://localhost:3001/produtos/'
                    }
                }
            }

            return res.status(200).send(response)
            }
        )
    })
})

// INSERE UM PRODUTO
router.post('/', upload.single('imagem_produto'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
        'INSERT INTO produtos (nome,preco,imagem_produto) VALUES (?,?,?)',
        [
            req.body.nome, 
            req.body.preco, 
            req.file.path
        ],
        (error, result, field) => {
            // liberar o pool pra não estourar o limite de conexões
            conn.release()

            if (error) {
                return res.status(500).send({ error: error })
            }

            const response = {
                mensagem: 'Produto inserido com sucesso!',
                prdutoCriado: {
                    id_produto: result.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    imagem_produto: req.file.path,
                    request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    URL: 'http://localhost:3001/produtos/'
                    }
                }
            }

            return res.status(201).send(response)
            }
        )
    })
})

// ALTERA UM PRODUTO
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
        return res.status(500).send({ error: error })
        }
        conn.query(
        `UPDATE produtos SET nome = ?, preco = ?
                        WHERE id_produto = ?`,
        [req.body.nome, req.body.preco, req.body.id_produto],
        (error, result, field) => {
            // liberar o pool pra não estourar o limite de conexões
            conn.release()

            if (error) {
            return res.status(500).send({ error: error })
            }

            const response = {
            mensagem: 'Produto atualizado com sucesso!',
            prdutoAtulizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                tipo: 'PATCH',
                descricao: `Dados do produto ${req.body.id_produto} alterados com sucesso`,
                URL: 'http://localhost:3001/produtos/' + req.body.id_produto
                }
            }
            }

            return res.status(202).send(response)
        }
        )
    })
})

// EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        // TESTA SE EXISTE O ID_PRODUTO PARA A EXCLUSÃO
        conn.query('SELECT * FROM produtos WHERE id_produto = ?', [req.body.id_produto], 
        (error, result, field) => {

            if (error) { return res.status(500).send({ error: error }) }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Produto não existente'
                })
            }
        
            conn.query(
            `DELETE FROM produtos
                        WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, result, field) => {
                // liberar o pool pra não estourar o limite de conexões
                conn.release()

                if (error) {
                    return res.status(500).send({ error: error })
                }

                const response = {
                mensagem: 'Produto removido com sucesso!',
                request: {
                    tipo: 'DELETE',
                    descricao: `Produto ${req.body.id_produto} excluído`,
                    url: 'http://localhost:3001/produtos/',
                    body: {
                        nome: 'String',
                        preco: 'Number'
                        }
                    }
                }

                res.status(202).send(response)
            })
        })
    })
})

module.exports = router
