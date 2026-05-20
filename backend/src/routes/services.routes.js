// Services Routes

const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);

// Admin routes
router.post('/', verifyToken, authorize('admin'), servicesController.createService);
router.put('/:id', verifyToken, authorize('admin'), servicesController.updateService);
router.delete('/:id', verifyToken, authorize('admin'), servicesController.deleteService);

module.exports = router;
