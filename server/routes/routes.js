const express = require('express');
const userController = require('../services/user/userController')
const campaignsController = require('../services/campaigns/campaignsController')
const userCampaignPlatformsController = require('../services/user_campaign_platforms/userCampaignPlatformsController')
const leadController = require('../services/lead/LeadController')
const router = express.Router();

// User routes
router.use('/api/user', userController);
router.use('/api/user-campaign-platforms', userCampaignPlatformsController);
router.use('/api/campaigns', campaignsController);
router.use('/api/lead', leadController);

module.exports = router;