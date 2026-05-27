// Galleries and Photos Routes

const express = require('express');
const router = express.Router();
const galleriesController = require('../controllers/galleries.controller');
const { verifyToken, authorize, optionalAuth } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Gallery routes
router.get('/', optionalAuth, galleriesController.getAllGalleries);
router.get('/:id', optionalAuth, galleriesController.getGalleryById);
router.post('/', verifyToken, authorize('admin', 'staff'), galleriesController.createGallery);
router.put('/:id', verifyToken, authorize('admin', 'staff'), galleriesController.updateGallery);
router.delete('/:id', verifyToken, authorize('admin', 'staff'), galleriesController.deleteGallery);

// Photo routes
router.get('/:gallery_id/photos', galleriesController.getGalleryPhotos);
router.post('/:id/photos', verifyToken, authorize('admin', 'staff'), upload.single('photo'), galleriesController.uploadPhoto);
router.put('/photos/:id', verifyToken, authorize('admin', 'staff'), galleriesController.updatePhoto);
router.delete('/photos/:id', verifyToken, authorize('admin', 'staff'), galleriesController.deletePhoto);

module.exports = router;
