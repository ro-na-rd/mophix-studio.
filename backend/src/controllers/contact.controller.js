// Contact Inquiries Controller

const { ContactInquiry, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Get all inquiries (Admin)
const getAllInquiries = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        
        const where = {};
        if (status) where.status = status;

        const offset = (page - 1) * limit;

        const { count, rows } = await ContactInquiry.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['first_name', 'last_name'], as: 'respondedBy' }
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

// Get inquiry by ID
const getInquiryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const inquiry = await ContactInquiry.findByPk(id);

        if (!inquiry) {
            return next(new AppError('Inquiry not found', 404));
        }

        res.json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Create inquiry (Public)
const createInquiry = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message, inquiry_type } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return next(new AppError('Please provide all required fields', 400));
        }

        const inquiry = await ContactInquiry.create({
            name,
            email,
            phone,
            subject,
            message,
            inquiry_type: inquiry_type || 'general',
            status: 'new'
        });

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully. We will contact you soon.',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Update inquiry status (Admin)
const updateInquiryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'in_progress', 'resolved', 'spam'];
        if (!validStatuses.includes(status)) {
            return next(new AppError('Invalid status', 400));
        }

        const inquiry = await ContactInquiry.findByPk(id);
        if (!inquiry) {
            return next(new AppError('Inquiry not found', 404));
        }

        await inquiry.update({ status });

        res.json({
            success: true,
            message: 'Inquiry status updated',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Respond to inquiry (Admin)
const respondToInquiry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { response_message } = req.body;

        const inquiry = await ContactInquiry.findByPk(id);
        if (!inquiry) {
            return next(new AppError('Inquiry not found', 404));
        }

        await inquiry.update({
            response_message,
            response_date: new Date(),
            responded_by: req.user.user_id,
            status: 'resolved'
        });

        // In production, send email to inquiry sender
        // emailService.sendInquiryResponse(inquiry.email, response_message);

        res.json({
            success: true,
            message: 'Response sent successfully',
            data: inquiry
        });
    } catch (error) {
        next(error);
    }
};

// Get inquiry statistics (Admin)
const getInquiryStats = async (req, res, next) => {
    try {
        const total = await ContactInquiry.count();
        const newCount = await ContactInquiry.count({ where: { status: 'new' } });
        const inProgress = await ContactInquiry.count({ where: { status: 'in_progress' } });
        const resolved = await ContactInquiry.count({ where: { status: 'resolved' } });

        res.json({
            success: true,
            data: {
                total,
                new: newCount,
                in_progress: inProgress,
                resolved,
                response_rate: total > 0 ? ((resolved / total) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInquiries,
    getInquiryById,
    createInquiry,
    updateInquiryStatus,
    respondToInquiry,
    getInquiryStats
};
