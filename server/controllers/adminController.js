const jwt = require('jsonwebtoken');
const config = require('../config');

// Login handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // TODO: Add your actual user verification logic here
        // This is just an example
        const userData = {
            id: "user_id",
            name: "User Name",
            role: "admin",
            email
        };

        // Generate JWT token
        const token = jwt.sign(
            { id: userData.id, role: userData.role },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Return minimal user data and token
        res.json({
            token,
            user: {
                id: userData.id,
                name: userData.name,
                role: userData.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

// Get user data handler
exports.getUserData = async (req, res) => {
    try {
        // req.user is set by auth middleware
        // TODO: Fetch complete user data from database using req.user.id
        const userData = {
            id: req.user.id,
            name: "User Name",
            role: req.user.role,
            // Add any additional user data you want to return
        };

        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
};
