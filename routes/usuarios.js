const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios-controller')

// CHAMA CONTROLLERS (RETORNAR, CADASTRAR USUÁRIOS E LOGIN)
router.post('/cadastro', UsuariosController.cadastrarUsuario)
router.post('/login', UsuariosController.loginUsuario)
router.get('/', UsuariosController.listaUsuarios);

module.exports = router; 