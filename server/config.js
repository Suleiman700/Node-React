const config = {
  port: process.env.PORT || 3010,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'leads_suleiman',
    port: process.env.DB_PORT || 3307,
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

module.exports = config;
