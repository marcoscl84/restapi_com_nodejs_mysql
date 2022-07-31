const express = require('express')
const router = express.Router()

const PedidosController = require('../controllers/pedidos-controller');

// CHAMA CONTROLLERS (RETORNAR, INSERIR, EDITAR E APAGAR PEDIDOS)
router.get('/', PedidosController.getPedidos);
router.post('/', PedidosController.postPedidos);
router.get('/:id_pedido', PedidosController.getUmPedido);
router.delete('/', PedidosController.deletePedidos);

module.exports = router
