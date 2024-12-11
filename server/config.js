const config = {
  port: process.env.PORT || 3010,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'leads',
    port: process.env.DB_PORT || 3306,
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

module.exports = config;
