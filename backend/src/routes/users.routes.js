// Users Routes

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// User profile routes
router.put('/:id', verifyToken, usersController.updateUserProfile);
router.get('/:id', verifyToken, usersController.getUserById);

// Admin routes
router.get('/', verifyToken, authorize('admin'), usersController.getAllUsers);
router.put('/:id/role', verifyToken, authorize('admin'), usersController.updateUserRole);
router.patch('/:id/toggle-active', verifyToken, authorize('admin'), usersController.toggleUserActive);

module.exports = router;
