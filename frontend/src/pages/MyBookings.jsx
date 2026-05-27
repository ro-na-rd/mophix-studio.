import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsService } from '../services/api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';
import ClientSidebar from '../components/ClientSidebar';

const STATUS_CONFIG = {
  pending: { label: 'Pending', cls: 'badge-pending', icon: '🕐' },
  confirmed: { label: 'Confirmed', cls: 'badge-confirmed', icon: '✅' },
  completed: { label: 'Completed', cls: 'badge-completed', icon: '🎉' },
  cancelled: { label: 'Cancelled', cls: 'badge-cancelled', icon: '❌' },
};

const PAYMENT_CONFIG = {
  unpaid: { label: 'Unpaid', cls: 'badge-cancelled' },
  partial: { label: 'Partial', cls: 'badge-pending' },
  paid: { label: 'Paid', cls: 'badge-completed' },
};

const MyBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsService.getAll({ user_id: user?.user_id });
      const data = res?.data || res || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      // Keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered =
    activeFilter === 'all' ? bookings : bookings.filter((b) => b.status === activeFilter);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try {
      await bookingsService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled');
      fetchBookings();
    } catch {
      toast.error('Could not cancel booking');
    }
  };

  const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen py-16">
      <ClientSidebar />
      <div className="ml-64">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <p className="section-tag">My Account</p>
              <h1 className="section-title mb-0">My Bookings</h1>
              <p className="text-gray-400 mt-1">Track and manage your photography sessions</p>
            </div>
            <Link to="/services" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book New Session
            </Link>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: bookings.length, color: 'text-white' },
              {
                label: 'Pending',
                value: bookings.filter((b) => b.status === 'pending').length,
                color: 'text-yellow-400',
              },
              {
                label: 'Confirmed',
                value: bookings.filter((b) => b.status === 'confirmed').length,
                color: 'text-blue-400',
              },
              {
                label: 'Completed',
                value: bookings.filter((b) => b.status === 'completed').length,
                color: 'text-green-400',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-gray-500 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                  activeFilter === tab
                    ? 'bg-orange-500 text-black'
                    : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {tab === 'all' ? 'All Bookings' : tab}
                {tab !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">({bookings.filter((b) => b.status === tab).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <svg className="animate-spin w-10 h-10 text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-400">Loading your bookings...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No bookings yet</h3>
              <p className="text-gray-400 mb-6">
                {activeFilter === 'all'
                  ? "You haven't made any booking requests yet."
                  : `No ${activeFilter} bookings found.`}
              </p>
              <Link to="/services" className="btn-primary inline-flex">
                Explore Our Services
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((booking) => {
                const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                const payment = PAYMENT_CONFIG[booking.payment_status] || PAYMENT_CONFIG.unpaid;

                return (
                  <div
                    key={booking.booking_id}
                    className="card p-6 cursor-pointer"
                    onClick={() => setSelected(booking)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                          {status.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h3 className="text-white font-semibold">{booking.Service?.name || 'Photography Session'}</h3>
                            <span className={`badge ${status.cls}`}>{status.label}</span>
                            <span className={`badge ${payment.cls}`}>{payment.label}</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            📅{' '}
                            {booking.event_date
                              ? new Date(booking.event_date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Date TBD'}
                          </p>
                          <p className="text-gray-500 text-sm">📍 {booking.event_location || 'Location TBD'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-orange-400 font-bold text-lg">
                          RWF {Number(booking.total_price || booking.Service?.price || 0).toLocaleString()}
                        </p>
                        {booking.status === 'pending' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(booking.booking_id);
                            }}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="text-gray-500 text-sm">
                          <span className="text-gray-400 font-medium">Notes: </span>
                          {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Detail Modal */}
          {selected && (
            <div className="modal-overlay" onClick={() => setSelected(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Booking Details</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ['Service', selected.Service?.name || 'N/A'],
                    ['Status', selected.status],
                    ['Payment', selected.payment_status],
                    [
                      'Event Date',
                      selected.event_date ? new Date(selected.event_date).toDateString() : 'N/A',
                    ],
                    ['Location', selected.event_location || 'N/A'],
                    ['Participants', selected.number_of_participants],
                    ['Total Price', `RWF ${Number(selected.total_price || 0).toLocaleString()}`],
                  ].map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{key}</span>
                      <span className="text-gray-200 font-medium capitalize">{val}</span>
                    </div>
                  ))}

                  {selected.special_requests && (
                    <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-gray-500 mb-1">Special Requests</p>
                      <p className="text-gray-300">{selected.special_requests}</p>
                    </div>
                  )}

                  {selected.notes && (
                    <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-gray-500 mb-1">Admin Notes</p>
                      <p className="text-gray-300">{selected.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;


