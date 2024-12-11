const express = require('express');
const userController = require('../services/user/userController')

const router = express.Router();

// User routes
router.use('/api/user', userController);

module.exports = router;