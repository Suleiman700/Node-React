const express = require('express');
const router = express.Router();
const config = require('../../config');
const {verify} = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const LeadModel = require('../lead/LeadModel');
const UserCampaignPlatformsModel = require('../user_campaign_platforms/UserCampaignPlatformsModel');
const Logger = require("../../utils/logger");

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

router.post('/delete/:id', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    const campaignId = req.params.id;

    try {
        // Get campaign data
        let recordData = await LeadModel.findByKeyValue('id', campaignId);
        if (recordData == null) {
            res.status(404).json({message: 'No records found'});
        }
        recordData = recordData[0];

        // Check if user owns this campaign
        if (recordData.user_id != userId) {
            res.status(401).json({message: 'You dont own this record'});
            return;
        }

        const deletedResult = await LeadModel.delete(recordData.id, userId);
        if (deletedResult) {
            res.status(200).json(true);
            return
        }
        else {
            res.status(400).json({message: 'Failed to delete'});
            return
        }
    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
        return;
    }
})

module.exports = router;
