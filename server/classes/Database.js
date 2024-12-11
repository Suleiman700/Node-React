const mysql = require('mysql2/promise');
// @ts-ignore
const config = require('../config');

class Database {
    static pool;

    constructor() {}

    connection()
    {
        if (!this.pool) {
            this.pool = mysql.createPool({
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database,
                port: config.database.port,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        return this.pool;
    }
}

module.exports = new Database();