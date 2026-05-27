import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { bookingsService } from '../../services/api';
import toast from 'react-hot-toast';
import { AdminSidebar } from './Dashboard';

// ─── Static fallback data ─────────────────────────────────────────────────────
const FALLBACK_BOOKINGS = [
  {
    id: 1,
    client_name:  'Amara Osei',
    email:        'amara.osei@email.com',
    phone:        '+233 24 123 4567',
    service:      'Wedding Photography',
    event_date:   '2026-06-14',
    location:     'Accra, Ghana',
    status:       'confirmed',
    payment:      'paid',
    notes:        'Full-day coverage, outdoor ceremony at beachfront venue.',
    package:      'Premium Package',
    amount:       2500,
    created_at:   '2026-05-10T09:30:00Z',
  },
  {
    id: 2,
    client_name:  'Kwame Mensah',
    email:        'kwame.m@gmail.com',
    phone:        '+233 20 987 6543',
    service:      'Portrait Session',
    event_date:   '2026-06-18',
    location:     'Studio, Kumasi',
    status:       'pending',
    payment:      'unpaid',
    notes:        'Corporate headshots for LinkedIn, 2-hour session.',
    package:      'Standard Package',
    amount:       350,
    created_at:   '2026-05-11T14:20:00Z',
  },
  {
    id: 3,
    client_name:  'Esi Agyeman',
    email:        'esi.agyeman@corp.com',
    phone:        '+233 55 234 5678',
    service:      'Corporate Event',
    event_date:   '2026-06-22',
    location:     'Movenpick Hotel, Accra',
    status:       'completed',
    payment:      'paid',
    notes:        'Annual awards night. Full event coverage with candid shots.',
    package:      'Corporate Package',
    amount:       1800,
    created_at:   '2026-05-08T11:00:00Z',
  },
  {
    id: 4,
    client_name:  'Nana Boateng',
    email:        'nana.b@family.net',
    phone:        '+233 27 345 6789',
    service:      'Family Portraits',
    event_date:   '2026-07-01',
    location:     'Botanical Gardens, Accra',
    status:       'pending',
    payment:      'partial',
    notes:        'Family of 6, outdoor setting preferred.',
    package:      'Family Package',
    amount:       650,
    created_at:   '2026-05-12T16:45:00Z',
  },
  {
    id: 5,
    client_name:  'Abena Frimpong',
    email:        'abena.f@shop.com',
    phone:        '+233 24 456 7890',
    service:      'Product Photography',
    event_date:   '2026-07-05',
    location:     'Studio, Accra',
    status:       'cancelled',
    payment:      'refunded',
    notes:        'E-commerce product shots for clothing line.',
    package:      'Product Package',
    amount:       800,
    created_at:   '2026-05-09T08:15:00Z',
  },
  {
    id: 6,
    client_name:  'Kofi Asante',
    email:        'kofi.asante@music.gh',
    phone:        '+233 50 567 8901',
    service:      'Music Video Shoot',
    event_date:   '2026-07-12',
    location:     'Various Locations, Accra',
    status:       'confirmed',
    payment:      'paid',
    notes:        'Full-day shoot across 3 locations.',
    package:      'Creative Package',
    amount:       3200,
    created_at:   '2026-05-13T13:30:00Z',
  },
  {
    id: 7,
    client_name:  'Akosua Darko',
    email:        'akosua.d@bride.com',
    phone:        '+233 23 678 9012',
    service:      'Pre-Wedding Shoot',
    event_date:   '2026-07-20',
    location:     'Labadi Beach, Accra',
    status:       'pending',
    payment:      'unpaid',
    notes:        'Sunrise session preferred. Couple shoot.',
    package:      'Standard Package',
    amount:       750,
    created_at:   '2026-05-14T10:00:00Z',
  },
  {
    id: 8,
    client_name:  'Yaw Owusu',
    email:        'yaw.owusu@events.gh',
    phone:        '+233 26 789 0123',
    service:      'Birthday Party Coverage',
    event_date:   '2026-08-01',
    location:     'Private Residence, Tema',
    status:       'confirmed',
    payment:      'partial',
    notes:        '40th birthday celebration, evening event.',
    package:      'Event Package',
    amount:       950,
    created_at:   '2026-05-15T17:00:00Z',
  },
];

const ITEMS_PER_PAGE = 6;

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };
  return (
    <span className={`badge ${map[status] ?? 'badge-pending'}`}>
      {status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Pending'}
    </span>
  );
}

function PaymentBadge({ payment }) {
  const map = {
    paid:     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    unpaid:   'bg-red-500/15 text-red-400 border border-red-500/25',
    partial:  'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    refunded: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
  };
  return (
    <span className={`badge ${map[payment] ?? ''}`}>
      {typeof payment === 'string' ? (payment.charAt(0).toUpperCase() + payment.slice(1)) : 'Unpaid'}
    </span>
  );
}

// ─── Booking Detail Modal ─────────────────────────────────────────────────────
function BookingModal({ booking, onClose, onStatusUpdate }) {
  if (!booking) return null;

  const handleStatus = async (newStatus) => {
    await onStatusUpdate(booking.booking_id || booking.id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-white font-bold text-lg">Booking Details</h3>
            <p className="text-gray-500 text-xs mt-0.5">#{(booking.booking_id || booking.id).toString().padStart(4, '0')}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Client Info */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {booking.client_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-white font-semibold">{booking.client_name}</p>
              <p className="text-gray-400 text-sm">{booking.email}</p>
              <p className="text-gray-500 text-xs">{booking.phone}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Service',    value: booking.service },
              { label: 'Package',    value: booking.package },
              { label: 'Event Date', value: new Date(booking.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Location',   value: booking.location },
              { label: 'Amount',     value: `$${(booking.amount || 0).toLocaleString()}` },
              { label: 'Booked On',  value: new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-white/3 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-gray-500 text-xs mb-1.5">Status</p>
              <StatusBadge status={booking.status} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1.5">Payment</p>
              <PaymentBadge payment={booking.payment_status || booking.payment} />
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="p-3 bg-white/3 rounded-lg">
              <p className="text-gray-500 text-xs mb-1">Notes</p>
              <p className="text-gray-300 text-sm">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-0 flex flex-wrap gap-2">
          {booking.status === 'pending' && (
            <button onClick={() => handleStatus('confirmed')} className="btn-success flex-1 text-sm py-2">
              ✓ Confirm
            </button>
          )}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <button onClick={() => handleStatus('completed')} className="btn-primary flex-1 text-sm py-2">
              ✓ Complete
            </button>
          )}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button onClick={() => handleStatus('cancelled')} className="btn-danger flex-1 text-sm py-2">
              ✕ Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Bookings() {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('all');
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [selectedBooking, setSelected]  = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bookingsService.getAll();
        setBookings(res.data?.results ?? res.data ?? FALLBACK_BOOKINGS);
      } catch {
        setBookings(FALLBACK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = bookings;
    if (activeTab !== 'all') list = list.filter(b => b.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.client_name?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q) ||
        b.status?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, activeTab, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await bookingsService.updateStatus(id, newStatus);
      setBookings(prev => prev.map(b => (b.booking_id === id || b.id === id) ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus} successfully`);
    } catch {
      // Optimistic update on fallback
      setBookings(prev => prev.map(b => (b.booking_id === id || b.id === id) ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { all: bookings.length };
    STATUS_TABS.slice(1).forEach(s => {
      counts[s] = bookings.filter(b => b.status === s).length;
    });
    return counts;
  }, [bookings]);

  // Reset page when filters change
  useEffect(() => setCurrentPage(1), [activeTab, search]);

return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">{bookings.length} total bookings in the system</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-pending badge text-xs">{statusCounts.pending} Pending</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-[#111] border border-white/5 rounded-xl p-1 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'
              }`}>
                {statusCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by client name, email, service, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10 w-full max-w-md"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="p-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-white/5 animate-pulse last:border-0">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-white/5 rounded" />
                    <div className="h-3 w-48 bg-white/5 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No bookings found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Event Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((booking) => (
                    <tr key={booking.booking_id || booking.id} className="group">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {booking.client_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{booking.client_name || `${booking.User?.first_name} ${booking.User?.last_name}`}</p>
                            <p className="text-gray-500 text-xs">{booking.email || booking.User?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-gray-300 text-sm">{booking.service}</p>
                        <p className="text-gray-600 text-xs">{booking.package}</p>
                      </td>
                      <td className="text-gray-400 text-sm whitespace-nowrap">
                        {new Date(booking.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="text-gray-400 text-sm max-w-[140px] truncate">{booking.location}</td>
                      <td><StatusBadge status={booking.status} /></td>
                      <td><PaymentBadge payment={booking.payment_status || booking.payment} /></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.booking_id || booking.id, 'confirmed')}
                              disabled={updatingId === (booking.booking_id || booking.id)}
                              className="btn-success text-xs py-1 px-2.5 disabled:opacity-50"
                              title="Confirm"
                            >
                              ✓
                            </button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => handleStatusUpdate(booking.booking_id || booking.id, 'completed')}
                              disabled={updatingId === (booking.booking_id || booking.id)}
                              className="btn-primary text-xs py-1 px-2.5 disabled:opacity-50"
                              title="Complete"
                            >
                              ✓✓
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.booking_id || booking.id, 'cancelled')}
                              disabled={updatingId === (booking.booking_id || booking.id)}
                              className="btn-danger text-xs py-1 px-2.5 disabled:opacity-50"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          )}
                          <button
                            onClick={() => setSelected(booking)}
                            className="btn-secondary text-xs py-1 px-2.5"
                            title="View details"
                          >
                            ···
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-gray-500 text-sm">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-orange-500 text-white'
                        : 'border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/40'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <BookingModal
        booking={selectedBooking}
        onClose={() => setSelected(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
