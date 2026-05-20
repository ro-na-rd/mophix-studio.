// Authentication Controller

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Register
const register = async (req, res, next) => {
    try {
        const { email, password, password_confirm, first_name, last_name, phone } = req.body;

        // Validation
        if (!email || !password || !first_name || !last_name) {
            return next(new AppError('Please provide all required fields', 400));
        }

        if (password !== password_confirm) {
            return next(new AppError('Passwords do not match', 400));
        }

        if (password.length < 6) {
            return next(new AppError('Password must be at least 6 characters', 400));
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already registered', 400));
        }

        // Create user
        const user = await User.create({
            email,
            password_hash: password,
            first_name,
            last_name,
            phone,
            role: 'client'
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Check if user is active
        if (!user.is_active) {
            return next(new AppError('User account is disabled', 403));
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.user_id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.json({
            success: true,
            data: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// Logout (frontend handles)
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

// Request password reset
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Don't reveal if email exists
            return res.json({
                success: true,
                message: 'If email exists, password reset link has been sent'
            });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // In production, send email with reset link
        // Email service would include: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}

        res.json({
            success: true,
            message: 'Password reset link sent to email',
            // Only for development
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token, password, password_confirm } = req.body;

        if (!token || !password || !password_confirm) {
            return next(new AppError('Please provide token and password', 400));
        }

        if (password !== password_confirm) {
            return next(new AppError('Passwords do not match', 400));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.user_id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Update password
        await user.update({ password_hash: password });

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Reset token expired', 400));
        }
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    requestPasswordReset,
    resetPassword
};
