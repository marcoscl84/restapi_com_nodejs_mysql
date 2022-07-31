const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer'); // middleware for handling multipart/form-data , which is primarily used for uploading files
const login = require('../middleware/login');

const ProdutosController = require('../controllers/produtos-controller');


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

// CHAMA CONTROLLERS (RETORNAR, INSERIR, EDITAR E APAGAR PEDIDOS)
router.get('/', ProdutosController.getProdutos);
router.post('/',  login.obligatory, upload.single('imagem_produto'), ProdutosController.postProdutos);
router.get('/:id_produto', ProdutosController.getUmProduto);
router.patch('/', login.obligatory, ProdutosController.editaProdutos)
router.delete('/', login.obligatory, ProdutosController.deleteProduto)

module.exports = router
