const express = require('express');
const router = express.Router();
const AdminModel = require('./adminModel');
const config = require('../../config');
const Hash = require('../../utils/Hash');
const { signLoginToken } = require('./adminService');
const {verify} = require('jsonwebtoken');
const {adminOnly} = require('../../middleware/roleAuth');
const jwtDecode = require('jwt-decode');

// const {adminOnly} = require('../../middleware/roleAuth');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        res.status(401).json({message: 'Invalid token'});
    }

    verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            res.status(403).json({message: err});
            return;
        }

        next();
    })
}


// POST login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const Admin = await AdminModel.findByEmail(email);
        if (Admin['id'] && await Hash.validateHash(password, Admin['password'])) {
            // Sign login token
            const loginToken = await signLoginToken(Admin);

            res.json({
                message: 'Login successful',
                token: loginToken,
            });
        }
        else {
            res.status(401).json({message: 'Invalid email or password'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
});

router.get('/me', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    try {
        const Admin = await AdminModel.findByKeyValue('id', userId);
        if (Admin != null) {
            res.json({
                id: Admin.id,
                name: Admin.name,
                email: Admin.email,
            });
        }
        else {
            res.status(404).json({message: 'No user found'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

module.exports = router;
