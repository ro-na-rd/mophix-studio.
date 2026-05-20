// Blog Routes

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', blogController.getAllBlogPosts);
router.get('/categories', blogController.getAllBlogCategories);
router.get('/post/:slug', blogController.getBlogPostBySlug);

// Admin routes
router.post('/', verifyToken, authorize('admin'), blogController.createBlogPost);
router.put('/:id', verifyToken, authorize('admin'), blogController.updateBlogPost);
router.delete('/:id', verifyToken, authorize('admin'), blogController.deleteBlogPost);
router.get('/drafts', verifyToken, authorize('admin'), blogController.getDraftPosts);

// Category management
router.post('/categories', verifyToken, authorize('admin'), blogController.createBlogCategory);

module.exports = router;
