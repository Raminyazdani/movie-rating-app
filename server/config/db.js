// File: config/db.js

const mysql = require('mysql2/promise');
const {MYSQL_CONFIG} = require('./mysql-config');

const pool = mysql.createPool({
    ...MYSQL_CONFIG
});

module.exports = pool;
