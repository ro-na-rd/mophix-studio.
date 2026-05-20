// Bookings Controller

const { Booking, User, Service, Testimonial } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Get all bookings (with filters)
const getAllBookings = async (req, res, next) => {
    try {
        const { status, user_id, page = 1, limit = 20 } = req.query;
        const where = {};

        if (status) where.status = status;
        if (user_id && req.user.role === 'client') {
            where.user_id = req.user.user_id;
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Booking.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone'] },
                { model: Service, attributes: ['service_id', 'name', 'price'] }
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

// Get booking by ID
const getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id, {
            include: [
                { model: User },
                { model: Service },
                { model: Testimonial }
            ]
        });

        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Create booking
const createBooking = async (req, res, next) => {
    try {
        const {
            service_id,
            event_date,
            event_location,
            number_of_participants,
            special_requests,
            preferred_time_start,
            preferred_time_end
        } = req.body;

        // Get service for pricing
        const service = await Service.findByPk(service_id);
        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        const booking = await Booking.create({
            user_id: req.user.user_id,
            service_id,
            booking_date: new Date(),
            event_date,
            event_location,
            number_of_participants,
            special_requests,
            preferred_time_start,
            preferred_time_end,
            total_price: service.price,
            status: 'pending'
        });

        // Reload with associations
        await booking.reload({
            include: [
                { model: User },
                { model: Service }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Booking request created successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Update booking status (Admin/Staff)
const updateBookingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return next(new AppError('Invalid booking status', 400));
        }

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (notes) updateData.notes = notes;

        await booking.update(updateData);

        res.json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Update payment status
const updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        const validPaymentStatuses = ['unpaid', 'paid', 'partial'];
        if (!validPaymentStatuses.includes(payment_status)) {
            return next(new AppError('Invalid payment status', 400));
        }

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        await booking.update({ payment_status });

        res.json({
            success: true,
            message: 'Payment status updated',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// Delete booking
const deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);

        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        // Only allow cancellation if pending or confirmed
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return next(new AppError('Cannot delete booking with this status', 400));
        }

        await booking.destroy();

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get bookings calendar (for admin dashboard)
const getBookingsCalendar = async (req, res, next) => {
    try {
        const { year, month } = req.query;
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const bookings = await Booking.findAll({
            where: {
                event_date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: User, attributes: ['first_name', 'last_name'] },
                { model: Service, attributes: ['name'] }
            ]
        });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    updatePaymentStatus,
    deleteBooking,
    getBookingsCalendar
};
