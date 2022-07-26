const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const { response } = require('express');

// CRIAR USUÁRIO COM SENHA HASH
router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {

        if (err) { return res.status(500).send({ error: error }) }
        bcrypt.hash(req.body.senha, 10, (errbcrypt, hash) =>{

            if(errbcrypt){ return res.status(500).send({ error: errbcrypt }) }
            conn.query(
                'INSERT INTO usuarios (email, senha) VALUES (?,?)', 
                    [req.body.email, hash]),
                    (error, results) => {
                    conn.release();
                    if(error) { return res.status(500).send({ error: error }) }
                    response = {                   
                        mensagem: 'Usuário criado com sucesso!',
                        usuarioCriado: {
                            id_usuario: results.insertId,
                            email: req.body.email
                        }                   
                    }
                    return res.status(201).send(response);                   
                }
        })
    })
})

module.exports = router;