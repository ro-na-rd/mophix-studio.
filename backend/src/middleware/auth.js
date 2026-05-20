// Authentication Middleware

const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const { User } = require('../models');

// Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new AppError('No token provided', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired', 401));
        }
        next(new AppError('Invalid token', 401));
    }
};

// Check user role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden - Insufficient permissions', 403));
        }

        next();
    };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Silently fail - user remains unauthenticated
        }
    }

    next();
};

module.exports = { verifyToken, authorize, optionalAuth };
