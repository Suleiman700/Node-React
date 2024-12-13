const config = {
    port: process.env.PORT || 3010,
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'leady',
        port: process.env.DB_PORT || 3306,
    },
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    campaign: {
        tokenGenerationSalt: process.env.CAMPAIGN_TOKEN_GENERATION_SALT || '01676162898744197242528165578355'
    },
};

module.exports = config;
