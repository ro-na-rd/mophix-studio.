// Users Controller

const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Get all users (Admin only)
const getAllUsers = async (req, res, next) => {
    try {
        const { role, is_active = true, page = 1, limit = 20 } = req.query;
        
        const where = {};
        if (role) where.role = role;
        if (is_active !== undefined) where.is_active = is_active === 'true';

        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password_hash'] },
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

// Get user by ID
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, bio, address, city, country, profile_image_url } = req.body;

        // Users can only update their own profile
        if (req.user.role === 'client' && req.user.user_id !== parseInt(id)) {
            return next(new AppError('Unauthorized', 403));
        }

        const user = await User.findByPk(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            phone: phone || user.phone,
            bio: bio !== undefined ? bio : user.bio,
            address: address || user.address,
            city: city || user.city,
            country: country || user.country,
            profile_image_url: profile_image_url || user.profile_image_url
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['admin', 'staff', 'client'];
        if (!validRoles.includes(role)) {
            return next(new AppError('Invalid role', 400));
        }

        const user = await User.findByPk(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        await user.update({ role });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// Activate/Deactivate user (Admin only)
const toggleUserActive = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        await user.update({ is_active: !user.is_active });

        res.json({
            success: true,
            message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
            data: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserProfile,
    updateUserRole,
    toggleUserActive
};
