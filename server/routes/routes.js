const express = require('express');
const adminController = require('../services/admin/adminController')

const router = express.Router();

// User routes
router.use('/api/admin', adminController);

module.exports = router;