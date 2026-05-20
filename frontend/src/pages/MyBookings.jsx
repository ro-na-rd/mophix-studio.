import { useEffect, useState } from 'react';
import { bookingsService } from '../services/api';
import { useAuthStore } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsService.getAll({ user_id: user?.user_id });
        setBookings(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="section-title">My Bookings</h1>
        <p className="section-subtitle">View all your booking requests and status updates.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.booking_id} className="card p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Booking #{booking.booking_id}</h2>
                  <p className="text-gray-600">Event date: {booking.event_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status: <span className="font-semibold text-primary">{booking.status}</span></p>
                  <p className="text-sm text-gray-500">Payment: <span className="font-semibold">{booking.payment_status}</span></p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No bookings found yet. Book a service to get started.</div>
      )}
    </section>
  );
};

export default MyBookings;
