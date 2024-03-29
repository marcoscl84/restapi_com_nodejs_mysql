const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
        return res.status(500).send({ error: error })
        }
        conn.query(`SELECT pedidos.id_pedido, 
                            pedidos.quantidade, 
                            produtos.id_produto, 
                            produtos.nome, 
                            produtos.preco 
                    FROM pedidos 
                    INNER JOIN produtos 
                    ON produtos.id_produto = pedidos.id_produto`, 
        (error, result, fields) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        const response = {
            quantidade: result.length,
            pedidos: result.map(pedido => {
            return {
                id_pedido: pedido.id_pedido,
                quantidade: pedido.id_pedido,
                produto: {
                    id_produto: pedido.id_produto,
                    nome: pedido.nome,
                    preco: pedido.preco
                },
                request: {
                tipo: 'GET',
                descricao: `Retorna os dados do pedido => ${pedido.id_pedido}`,
                URL: 'http://localhost:3001/produtos/' + pedido.id_pedido
                }
            }
            })
        }

        return res.status(200).send({ response })
        })
    })
};

// RETORNA UM PEDIDO ESPECÍFICO
exports.getUmPedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
        'SELECT * FROM pedidos WHERE id_pedido = ?',
        [req.params.id_pedido],
        (error, result, fields) => {
            if (error) {
             return res.status(500).send({ error: error })
            }

            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Não foi encontrado nenhum pedido com este ID'
                })
            }

            const response = {
                pedido: {
                    id_pedido: result[0].id_pedido,
                    id_produto: result[0].id_produto,
                    quantidade: result[0].quantidade,
                    request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um pedido específico',
                    URL: 'http://localhost:3001/pedidos/'
                    }
                }
            }

            return res.status(200).send(response)
        }
        )
    })
};

// INSERE UM PEDIDO
exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
console.log(req.body.id_produto)
        // TESTA SE EXISTE O PRODUTO PARA ESSE PEDIDO
        conn.query('SELECT * FROM produtos WHERE id_produto = ?', [req.body.id_produto], 
        (error, result, field) => {

            if (error) { return res.status(500).send({ error: error }) }
            if (result.length == 0) {
                return res.status(404).send({
                    mensagem: 'Produto não existente'
                })
            }

            // SE NÃO EXISTE PEDIDO, FAZ O CADASTRO
                conn.query(
                'INSERT INTO pedidos (id_produto,quantidade) VALUES (?, ?)',
                [req.body.id_produto, req.body.quantidade],
                (error, result, field) => {
                    // liberar o pool pra não estourar o limite de conexões
                    conn.release()
            
                    if (error) {
                    return res.status(500).send({ error: error })
                    }
            
                    const response = {
                    mensagem: 'Produto inserido com sucesso!',
                        produtoCriado: {
                            id_pedido: result.id_pedido,
                            id_produto: req.body.id_produto,
                            quantidade: req.body.quantidade,
                            request: {
                            tipo: 'POST',
                            descricao: 'Efetua um pedido',
                            URL: 'http://localhost:3001/produtos/'
                            }
                        }
                    }
            
                    return res.status(201).send(response)
                }
            )
        })
    })
};

// EXCLUI UM PEDIDO
exports.deletePedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
        `DELETE FROM pedidos
                    WHERE id_pedido = ?`,
        [req.body.id_pedido],
        (error, result, field) => {
            // liberar o pool pra não estourar o limite de conexões
            conn.release()

            if (error) {
                return res.status(500).send({ error: error })
            }

            const response = {
            mensagem: 'Pedido removido com sucesso!',
            request: {
                tipo: 'DELETE',
                descricao: `Produto ${req.body.id_pedido} excluído`,
                url: 'http://localhost:3001/pedidos/',
                body: {
                    produtos_id_produto: 'Number',
                    quantidade: 'Number'
                    }
                }
            }

            res.status(202).send(response)
        }
        )
    })
}