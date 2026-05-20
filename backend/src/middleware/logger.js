// Logger Middleware

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        const log = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 400) {
            console.error(log);
        } else {
            console.log(log);
        }
    });

    next();
};

const logger = {
    info: (message, data = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    },
    error: (message, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    warn: (message, data = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
    }
};

module.exports = { requestLogger, logger };
