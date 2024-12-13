const express = require('express');
const router = express.Router();
const CampaignsModel = require('./campaignsModel');
const config = require('../../config');
const {verify} = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const CampaignService = require('./CampaignService');
const UserModel = require('../user/userModel');
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
        if (campaignData.user_id != userId) {
            res.status(401).json({message: 'You dont own this campaign'});
            return;
        }

        // Get passed new campaign data
        const passedCampaignData = req.body;

        // Remove unwanted properties from campaign data
        delete passedCampaignData.favicon_url;

        // If campaign contains platform name
        if (passedCampaignData.platform) {
            await UserCampaignPlatformsModel.findOrCreate(userId, passedCampaignData.platform);
        }

        // Update campaign
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

router.post('/create', authenticateToken, async (req, res) => {

    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwtDecode.jwtDecode(token).id;

    try {
        // Generate new token for the campaign
        const newToken = CampaignService.generateToken(userId);

        // Campaign data
        const campaignData = {
            ...req.body,
            token: newToken,
            user_id: userId, // Include user ID in campaign data
        };

        // Create campaign
        const newCampaignId = await CampaignsModel.create(campaignData);

        if (!newCampaignId) {
            return res.status(400).json({ state: false, message: 'Failed to create campaign' });
        }

        // Add platform name if its new
        const platformFound = await UserCampaignPlatformsModel.findByKeyValue('name', campaignData.platform)
        if (platformFound == null) {
            const platformData = {
                user_id: userId,
                name: campaignData.platform
            };
            const platformFound = UserCampaignPlatformsModel.create(platformData);
        }

        res.status(201).json({ id: newCampaignId, token: newToken });

    }
    catch (error) {
        res.status(500).json({state: false, error: error.message});
    }
})

router.post('/delete/:id', authenticateToken, async (req, res) => {

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
        if (campaignData.user_id != userId) {
            res.status(401).json({message: 'You dont own this campaign'});
            return;
        }

        const deletedResult = await CampaignsModel.delete(campaignData.id, userId);
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

router.post('/webhook/:token', async (req, res) => {
    try {
        // Log the incoming request with a unique emoji
        await Logger.logWebhook(req, '📡 Webhook received');

        const token = req.params.token;
        const leadData = req.body;

        if (!token) {
            // Log error with a red circle emoji
            await Logger.logWebhook(req, '❌ Error', new Error('No token provided'));
            return res.status(400).json({ message: 'No token provided' });
        }

        // Decode token
        const decodedToken = CampaignService.decodeToken(token);
        if (!decodedToken.isValid) {
            // Log error with a red circle emoji
            await Logger.logWebhook(req, '❌ Error', new Error('Bad token'));
            res.status(403).json({ message: 'Bad token' });
            return;
        }

        // Get user id from token
        const tokenUserId = decodedToken.userId;

        // Check if a user exists with that id
        const userFound = await UserModel.findByKeyValue('id', tokenUserId);

        if (userFound == null) {
            // Log error with a red circle emoji
            await Logger.logWebhook(req, '❌ Error', new Error('User cannot be found'));
            return res.status(403).json({ message: 'User cannot be found' });
        }

        // Get the campaign by user_id and token
        const campaignData = await CampaignsModel.findByKeyValue('token', token);
        if (campaignData == null) {
            // Log error with a red circle emoji
            await Logger.logWebhook(req, '❌ Error', new Error('Campaign not found'));
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const campaignId = campaignData[0].id;

        const leadToCreate = {
            userId: tokenUserId,
            campaignId: campaignId,
            data: leadData,
        };

        const leadCreateResult = await LeadModel.create(leadToCreate);

        if (!leadCreateResult) {
            // Log error with a red circle emoji
            await Logger.logWebhook(req, '❌ Error', new Error('Failed to create lead'));
            return res.status(500).json({ message: 'Failed to create lead' });
        }

        // Log successful request with a success emoji
        await Logger.logWebhook(req, '✅ Webhook processed successfully');

        // Respond to the webhook
        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        // Log error with a red circle emoji
        await Logger.logWebhook(req, '❌ Error', error);
        res.status(500).json({ state: false, error: error.message });
    } finally {
        // End log with a closing emoji
        await Logger.logWebhook(req, '🔚 Webhook processing completed');
    }
});

module.exports = router;
