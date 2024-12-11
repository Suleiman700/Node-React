const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({message: 'Access token required'});

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.status(403).json({message: 'Invalid token'});
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
