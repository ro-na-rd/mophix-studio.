// Dashboard Routes

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// All dashboard routes require admin authorization
router.use(verifyToken, authorize('admin'));

router.get('/stats', dashboardController.getDashboardStats);
router.get('/bookings/analytics', dashboardController.getBookingAnalytics);
router.get('/revenue/report', dashboardController.getRevenueReport);

module.exports = router;
