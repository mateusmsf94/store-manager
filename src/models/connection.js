const mysql = require('mysql2/promise');

const conection = mysql.createPool({
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'StoreManager',
});

module.exports = conection;