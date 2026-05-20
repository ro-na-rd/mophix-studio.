// Error Handling Middleware

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    console.error(`[ERROR] ${statusCode} - ${message}`, err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate Entry',
            field: err.errors[0].path
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Standard error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { errorHandler, AppError };
