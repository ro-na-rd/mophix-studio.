// Bookings Routes

const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Client routes
router.post('/', verifyToken, authorize('client', 'admin', 'staff'), bookingsController.createBooking);
router.get('/calendar/:month/:year', verifyToken, authorize('admin', 'staff'), bookingsController.getBookingsCalendar);

// Admin/Staff routes
router.get('/', verifyToken, authorize('admin', 'staff', 'client'), bookingsController.getAllBookings);
router.get('/:id', verifyToken, authorize('admin', 'staff', 'client'), bookingsController.getBookingById);
router.patch('/:id/status', verifyToken, authorize('admin', 'staff'), bookingsController.updateBookingStatus);
router.patch('/:id/payment', verifyToken, authorize('admin', 'staff'), bookingsController.updatePaymentStatus);
router.delete('/:id', verifyToken, authorize('client', 'admin'), bookingsController.deleteBooking);

module.exports = router;
