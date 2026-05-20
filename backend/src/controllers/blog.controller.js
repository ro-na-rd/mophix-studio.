// Blog Controller

const { BlogPost, BlogCategory, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const slugify = require('slugify');

// Get all published blog posts
const getAllBlogPosts = async (req, res, next) => {
    try {
        const { category_id, page = 1, limit = 10 } = req.query;
        
        const where = { status: 'published' };
        if (category_id) where.category_id = category_id;

        const offset = (page - 1) * limit;

        const { count, rows } = await BlogPost.findAndCountAll({
            where,
            include: [
                { model: BlogCategory, attributes: ['blog_category_id', 'name'] },
                { model: User, attributes: ['first_name', 'last_name'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['published_date', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get blog post by slug
const getBlogPostBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        
        const post = await BlogPost.findOne({
            where: { slug, status: 'published' },
            include: [
                { model: BlogCategory, attributes: ['name'] },
                { model: User, attributes: ['first_name', 'last_name'] }
            ]
        });

        if (!post) {
            return next(new AppError('Blog post not found', 404));
        }

        // Increment view count
        await post.increment('view_count');

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Create blog post (Admin)
const createBlogPost = async (req, res, next) => {
    try {
        const { title, content, featured_image_url, category_id, status } = req.body;

        const slug = slugify(title, { lower: true, strict: true });

        // Check if slug exists
        const existingPost = await BlogPost.findOne({ where: { slug } });
        if (existingPost) {
            return next(new AppError('A post with this title already exists', 400));
        }

        const post = await BlogPost.create({
            title,
            slug,
            content,
            featured_image_url,
            category_id,
            author_id: req.user.user_id,
            status: status || 'draft',
            published_date: status === 'published' ? new Date() : null
        });

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully',
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Update blog post (Admin)
const updateBlogPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, featured_image_url, category_id, status } = req.body;

        const post = await BlogPost.findByPk(id);
        if (!post) {
            return next(new AppError('Blog post not found', 404));
        }

        const updateData = {
            title: title || post.title,
            content: content || post.content,
            featured_image_url: featured_image_url || post.featured_image_url,
            category_id: category_id || post.category_id,
            status: status || post.status
        };

        // Update slug if title changed
        if (title && title !== post.title) {
            const newSlug = slugify(title, { lower: true, strict: true });
            const existingPost = await BlogPost.findOne({ where: { slug: newSlug } });
            if (existingPost && existingPost.post_id !== post.post_id) {
                return next(new AppError('A post with this title already exists', 400));
            }
            updateData.slug = newSlug;
        }

        // Handle publish status change
        if (status === 'published' && post.status !== 'published') {
            updateData.published_date = new Date();
        }

        await post.update(updateData);

        res.json({
            success: true,
            message: 'Blog post updated successfully',
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// Delete blog post (Admin)
const deleteBlogPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const post = await BlogPost.findByPk(id);
        if (!post) {
            return next(new AppError('Blog post not found', 404));
        }

        await post.destroy();

        res.json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get all blog categories
const getAllBlogCategories = async (req, res, next) => {
    try {
        const categories = await BlogCategory.findAll({
            order: [['display_order', 'ASC']]
        });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

// Create blog category (Admin)
const createBlogCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const slug = slugify(name, { lower: true, strict: true });

        const category = await BlogCategory.create({
            name,
            slug,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Blog category created successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

// Get draft posts (Admin)
const getDraftPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await BlogPost.findAndCountAll({
            where: { status: 'draft' },
            include: [
                { model: User, attributes: ['first_name', 'last_name'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getAllBlogCategories,
    createBlogCategory,
    getDraftPosts
};
