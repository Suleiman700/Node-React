const express = require('express');
const router = express.Router();
const CampaignsModel = require('./campaignsModel');
const config = require('../../config');
const {verify} = require('jsonwebtoken');
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

router.get('/', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    try {
        const records = await CampaignsModel.findByKeyValue('user_id', userId);
        if (records != null) {
            res.json(records);
        }
        else {
            res.status(404).json({message: 'No records found'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

router.get('/:id', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    const campaignId = req.params.id;

    try {
        const Campaign = await CampaignsModel.getCampaignByIdAndUser(campaignId, userId);
        if (Campaign != null) {
            res.json(Campaign);
        }
        else {
            res.status(404).json({message: 'No records found'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

router.post('/edit/:id', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    const campaignId = req.params.id;


    try {
        // Get campaign data
        let campaignData = await CampaignsModel.findByKeyValue('id', campaignId);
        if (campaignData == null) {
            res.status(404).json({message: 'No records found'});
        }
        campaignData = campaignData[0];

        // Check if user owns this campaign
        if (campaignData.id != userId) {
            res.status(401).json({message: 'You dont own this campaign'});
            return;
        }

        // Get passed new campaign data
        const passedCampaignData = req.body;

        const Campaign = await CampaignsModel.update(campaignData.id, passedCampaignData);
        if (Campaign != null) {
            res.json(Campaign);
        }
        else {
            res.status(404).json({message: 'No records found'});
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

module.exports = router;
