// Contact Routes

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Public routes
router.post('/', contactController.createInquiry);

// Admin routes
router.get('/', verifyToken, authorize('admin'), contactController.getAllInquiries);
router.get('/stats', verifyToken, authorize('admin'), contactController.getInquiryStats);
router.get('/:id', verifyToken, authorize('admin'), contactController.getInquiryById);
router.patch('/:id/status', verifyToken, authorize('admin'), contactController.updateInquiryStatus);
router.post('/:id/respond', verifyToken, authorize('admin'), contactController.respondToInquiry);

module.exports = router;
