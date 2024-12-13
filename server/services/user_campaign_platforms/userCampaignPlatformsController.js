const express = require('express');
const router = express.Router();
const UserCampaignPlatformsModel = require('../user_campaign_platforms/UserCampaignPlatformsModel');
const config = require('../../config');
const {verify} = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

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


/**
 * Get all user campaign platforms
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const userId = jwtDecode.jwtDecode(token).id;

        const Platforms = await UserCampaignPlatformsModel.findByKeyValue('user_id', userId);
        if (Platforms != null) {
            res.status(200).json(Platforms);
        }
        else {
            res.status(404).json({message: 'No data found'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

router.post('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const userId = jwtDecode.jwtDecode(token).id;

        const platformId = req.params.id;

        const Platforms = await UserCampaignPlatformsModel.findByKeyValue('id', platformId);
        if (Platforms == null) {
            res.status(404).json({message: 'No data found'});
            return;
        }
        const platformData = Platforms[0];

        // Check if platform is owned by user
        if (platformData?.user_id != userId) {
            res.status(401).json({message: 'You dont own this record'});
            return;
        }

        // Delete platform
        const deleteResult = await UserCampaignPlatformsModel.delete(platformId, userId);
        if (deleteResult != null) {
            res.status(200).json(true);
        }
        else {
            res.status(400).json({message: 'Could not delete record'});
            return;
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})


module.exports = router;
