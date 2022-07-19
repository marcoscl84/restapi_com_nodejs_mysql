const mysql = require('mysql')

var pool = mysql.createPool({
  user: 'root',
  password: 'root',
  database: 'ecommerce',
  host: 'localhost',
  port: 3307
})

exports.pool = pool

// variáveis de ambiente definidas em nodemon.json
