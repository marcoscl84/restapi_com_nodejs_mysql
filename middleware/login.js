const jwt = require('jsonwebtoken');

/* module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'chave-segredo-enviada-para-usuario')
        req.usuario = decode.token
        next()
    } catch (error) { 
        return res.status(401).send({ mensagem: 'Falha na autenticação do usuário' })
    } 
} */


// AUTENTICA SE OK
exports.obligatory = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'chave-segredo-enviada-para-usuario')
        req.usuario = decode.token
        next()
    } catch (error) { 
        return res.status(401).send({ mensagem: 'Falha na autenticação do usuário' })
    } 
}

// SE NÃO FIZER A AUTENTICAÇÃO, SEGUE IGUAL
exports.optional = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'chave-segredo-enviada-para-usuario')
        req.usuario = decode.token
        next()
    } catch (error) { 
        next();
    } 
}