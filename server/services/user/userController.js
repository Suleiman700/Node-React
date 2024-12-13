const express = require('express');
const router = express.Router();
const UserModel = require('./userModel');
const LeadsModel = require('../lead/LeadModel');
const CampaignsModel = require('../campaigns/campaignsModel');
const config = require('../../config');
const Hash = require('../../utils/Hash');
const { signLoginToken } = require('./userService');
const {verify} = require('jsonwebtoken');
// const {adminOnly} = require('../../middleware/roleAuth');
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
        const User = await UserModel.findByEmail(email);
        if (User['id'] && await Hash.validateHash(password, User['password'])) {
            // Sign login token
            const loginToken = await signLoginToken(User);

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
        const User = await UserModel.findByKeyValue('id', userId);
        if (User != null) {
            res.json({
                id: User.id,
                name: User.name,
                email: User.email,
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

/**
 * Get user leads
 *
 * Available params:
 * - returnType {string} count|all - The return type of the data
 */
router.get('/leads', authenticateToken, async (req, res) => {

    try {
        const token = req.headers['authorization'].split(' ')[1];
        const userId = jwtDecode.jwtDecode(token).id;

        // Extract the `returnType` parameter from the query
        const { returnType = 'all' } = req.query; // Default to 'all' if not provided

        const Leads = await LeadsModel.findByKeyValue('user_id', userId);
        if (Leads != null) {
            // Handle `returnType`
            if (returnType === 'count') {
                return res.status(200).json({ count: Leads.length });
            }
            else {
                res.status(200).json(Leads);
            }
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
