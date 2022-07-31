const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// CADASTRA USUÁRIO COM SENHA HASH
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        
        // VERIFICA ERRO NA CONEXÃO
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {          
            // VERIFICA ERRO NA QUERY
            if (error) { return res.status(500).send({ error: error }) }
            
            // VERIFICA SE EXISTE USUÁRIO CADASTRADO
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Usuário já cadastrado' })
            } else {
                
                // CRIPTOGRAFIA DA SENHA
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    // VERIFICA ERRO NO BCRYPT
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    
                    // INSERE USUÁRIO CRIADO
                    conn.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                        [req.body.email, hash],
                        (error, results) => {
                            conn.release();
                            // VERIFICA ERRO NA QUERY DE INSERÇÃO
                            if (error) { return res.status(500).send({ error: error }) }
                            response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id_usuario: results.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response);
                        })
                });
            }
        })

    });
})

// LOGIN
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(query, [req.body.email], (error, results, fields) =>{
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            
            // VERIFICA SE TEM REGISTRO
            if(results.length < 1){
                return res.status(401).send({ mensagem: 'Usuário inexistente' }) // mensagem de "email não encontrado (404)" é brecha de segurança dando pistas para ataque de força bruta
            }
            
            // VERIFICA SE SENHA ESTÁ CORRETA
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                // VERIFICA ERRO NO BCRYPT
                if(err){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                if(result){
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, 'chave-segredo-enviada-para-usuario',{
                        expiresIn: "1h" // expira em 1h
                    });


                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }
                // SE ERROU A SENHA
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            })
        })
    })
})
// client -> API login -> retorna token -> client armazena o token para manter-se logado



// MOSTRA TODOS OS USUÁRIOS CADASTRADOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query('SELECT * FROM usuarios', (error, result, fields) => {
        if (error) {
            return res.status(500).send({ error: error })
        }

        const response = {
            usuarios: result.map(usuario => {
                return {
                    id: usuario.id_usuario,
                    email: usuario.email,
                    senha: '*****'
                }
            })
        }

        return res.status(200).send({ response })
        })
    })
})

module.exports = router; 