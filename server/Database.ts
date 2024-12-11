const { createPool } = require('mysql2/promise');
const config = require('../config');

class Database {
    static pool;

    static connection() {
        if (!Database.pool) {
            Database.pool = createPool({
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
        return Database.pool;
    }
}

module.exports = Database;