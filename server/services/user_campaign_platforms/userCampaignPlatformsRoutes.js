const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../../middleware/auth');
const UserCampaignPlatformsController = require('./userCampaignPlatformsController');

// Validation middleware
const validatePlatform = [
    body('platform').notEmpty().withMessage('Platform is required'),
    body('credentials').notEmpty().withMessage('Credentials are required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

// Create a new platform
router.post('/', 
    auth,
    validatePlatform,
    UserCampaignPlatformsController.create.bind(UserCampaignPlatformsController)
);

// Get all platforms
router.get('/',
    auth,
    UserCampaignPlatformsController.getAll.bind(UserCampaignPlatformsController)
);

// Get one platform
router.get('/:id',
    auth,
    UserCampaignPlatformsController.getOne.bind(UserCampaignPlatformsController)
);

// Update a platform
router.put('/:id',
    auth,
    validatePlatform,
    UserCampaignPlatformsController.update.bind(UserCampaignPlatformsController)
);

// Delete a platform
router.delete('/:id',
    auth,
    UserCampaignPlatformsController.delete.bind(UserCampaignPlatformsController)
);

module.exports = router;
