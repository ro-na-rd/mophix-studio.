// Dashboard Controller

const { Booking, User, ContactInquiry, Testimonial, Gallery, Service } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
    try {
        // Count statistics
        const totalUsers = await User.count();
        const totalClients = await User.count({ where: { role: 'client' } });
        const totalBookings = await Booking.count();
        const totalInquiries = await ContactInquiry.count();
        
        // Bookings by status
        const bookingsByStatus = await Booking.count({ 
            attributes: ['status'],
            group: ['status']
        });

        // Recent bookings
        const recentBookings = await Booking.findAll({
            limit: 10,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['first_name', 'last_name'] },
                { model: Service, attributes: ['name'] }
            ]
        });

        // New inquiries
        const newInquiries = await ContactInquiry.count({
            where: { status: 'new' }
        });

        // Revenue calculation
        const totalRevenue = await Booking.sum('total_price', {
            where: { status: 'completed', payment_status: 'paid' }
        });

        // Average testimonial rating
        const avgRating = await Testimonial.findOne({
            attributes: [
                ['AVG(rating)', 'average_rating'],
                ['COUNT(*)', 'total_reviews']
            ],
            where: { is_approved: true }
        });

        // Popular services
        const popularServices = await Booking.findAll({
            attributes: [
                [sequelize.col('Service.service_id'), 'service_id'],
                [sequelize.col('Service.name'), 'service_name'],
                [sequelize.fn('COUNT', sequelize.col('Booking.booking_id')), 'booking_count']
            ],
            include: [
                { model: Service, attributes: [] }
            ],
            group: ['Service.service_id', 'Service.name'],
            raw: true,
            limit: 5,
            subQuery: false,
            order: [['booking_count', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    clients: totalClients,
                    staff: await User.count({ where: { role: 'staff' } }),
                    admins: await User.count({ where: { role: 'admin' } })
                },
                bookings: {
                    total: totalBookings,
                    byStatus: bookingsByStatus,
                    recent: recentBookings
                },
                inquiries: {
                    total: totalInquiries,
                    new: newInquiries
                },
                revenue: totalRevenue || 0,
                testimonials: {
                    average_rating: avgRating?.dataValues?.average_rating || 0,
                    total_reviews: avgRating?.dataValues?.total_reviews || 0
                },
                popular_services: popularServices
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get booking analytics
const getBookingAnalytics = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        const where = {};
        if (start_date && end_date) {
            where.created_at = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const bookings = await Booking.findAll({
            where,
            include: [
                { model: Service, attributes: ['name'] }
            ]
        });

        // Group by date
        const byDate = {};
        bookings.forEach(booking => {
            const date = booking.created_at.toISOString().split('T')[0];
            if (!byDate[date]) byDate[date] = [];
            byDate[date].push(booking);
        });

        res.json({
            success: true,
            data: {
                total: bookings.length,
                by_date: byDate,
                by_status: {
                    pending: bookings.filter(b => b.status === 'pending').length,
                    confirmed: bookings.filter(b => b.status === 'confirmed').length,
                    completed: bookings.filter(b => b.status === 'completed').length,
                    cancelled: bookings.filter(b => b.status === 'cancelled').length
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get revenue report
const getRevenueReport = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        const where = {
            status: 'completed',
            payment_status: 'paid'
        };

        if (start_date && end_date) {
            where.updated_at = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        const bookings = await Booking.findAll({
            where,
            include: [
                { model: Service, attributes: ['name'] },
                { model: User, attributes: ['first_name', 'last_name'] }
            ],
            order: [['updated_at', 'DESC']]
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0);
        const averageBookingValue = bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                total_revenue: totalRevenue.toFixed(2),
                total_bookings: bookings.length,
                average_booking_value: averageBookingValue,
                bookings
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getBookingAnalytics,
    getRevenueReport
};
