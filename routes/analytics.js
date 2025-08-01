const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { dashboardStats } = require('../controllers/analyticsController');

router.get('/dashboard', auth, dashboardStats);

module.exports = router;
