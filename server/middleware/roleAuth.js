const {verify} = require('jsonwebtoken');
const config = require('../config');
const checkRole2 = (requiredRole) => {
    return (req, res, next) => {
        console.log(req)
        // auth middleware should have already attached user to req
        // if (!req.user) {
        //     return res.status(401).json({ message: 'Unauthorized - No token provided' });
        // }

        // const userRole = req.user.role;
        //
        // // Check if user's role matches required role
        // if (userRole !== requiredRole) {
        //     return res.status(403).json({
        //         message: 'Forbidden - Insufficient permissions'
        //     });
        // }
    };
    next();
};

function checkAdminRole(req, res, next) {
    console.log(req)
    next();
}


// Predefined middleware for common roles
const roles = {
    ADMIN: 1,
    OWNER: 2,
    USER: 3
};

module.exports = {
    roles,
    // Convenience middlewares for common roles
    adminOnly: checkAdminRole,
    // ownerOnly: checkRole(roles.OWNER),
    // userOnly: checkRole(roles.USER)
};
