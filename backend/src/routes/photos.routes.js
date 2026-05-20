// Photos Routes

const express = require('express');
const router = express.Router();
const galleriesController = require('../controllers/galleries.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// For now, photos are managed through gallery endpoints
// This file can be extended if needed for standalone photo operations

router.get('/featured', galleriesController.getAllGalleries);

module.exports = router;
