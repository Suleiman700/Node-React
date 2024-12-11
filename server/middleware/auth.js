const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Token format: "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // Verify token and attach user data to request
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Add user data to request object
        // Make sure your token includes role when signing
        req.user = {
            id: decoded.id,
            role: decoded.role // This will be 1 for user, 2 for owner, 3 for user
        };
        
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authMiddleware;
