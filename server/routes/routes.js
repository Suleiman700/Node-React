const express = require('express');
const userController = require('../services/user/userController')
const campaignsController = require('../services/campaigns/campaignsController')

const router = express.Router();

// User routes
router.use('/api/user', userController);
router.use('/api/campaigns', campaignsController);

module.exports = router;