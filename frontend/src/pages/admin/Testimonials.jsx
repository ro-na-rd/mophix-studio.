import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { testimonialsService } from '../../services/api';

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    clientName: 'Amara Osei',
    email: 'amara.osei@gmail.com',
    rating: 5,
    quote:
      'Mophix Studio captured our wedding day beyond our imagination. Every frame tells a story — pure magic. We will cherish these photos forever!',
    date: '2025-11-12',
    status: 'approved',
    avatar: null,
  },
  {
    id: 2,
    clientName: 'Kofi Mensah',
    email: 'kofi.m@yahoo.com',
    rating: 5,
    quote:
      'The portrait session was phenomenal. The team made me feel so comfortable and the results were absolutely breathtaking. Highly recommended!',
    date: '2025-12-01',
    status: 'pending',
    avatar: null,
  },
  {
    id: 3,
    clientName: 'Esi Darko',
    email: 'esi.darko@hotmail.com',
    rating: 4,
    quote:
      'Incredible attention to detail and creativity. Our product shoot turned out exactly as we envisioned. Professional, timely, and stunning results.',
    date: '2025-12-18',
    status: 'pending',
    avatar: null,
  },
  {
    id: 4,
    clientName: 'Kwame Asante',
    email: 'k.asante@corp.com',
    rating: 5,
    quote:
      'The corporate headshots exceeded all expectations. Every colleague looks polished and professional. Mophix Studio is our go-to for all photography needs.',
    date: '2026-01-05',
    status: 'approved',
    avatar: null,
  },
  {
    id: 5,
    clientName: 'Abena Boateng',
    email: 'abena.b@gmail.com',
    rating: 3,
    quote:
      'Good experience overall, photos were delivered on time. A few shots didn\'t meet our vision but the team was responsive and professional throughout.',
    date: '2026-02-14',
    status: 'rejected',
    avatar: null,
  },
  {
    id: 6,
    clientName: 'Yaw Frimpong',
    email: 'yaw.frimpong@outlook.com',
    rating: 5,
    quote:
      'Our maternity shoot was absolutely magical! The lighting, composition, and editing were perfect. We are so grateful for these precious memories.',
    date: '2026-03-22',
    status: 'pending',
    avatar: null,
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-lg ${star <= rating ? 'text-orange-400' : 'text-gray-700'}`}
      >
        ★
      </span>
    ))}
    <span className="ml-1.5 text-xs text-gray-500 font-medium">{rating}/5</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const safeStatus = (status || '').toString();

  const config = {
    approved: 'badge badge-approved',
    pending: 'badge badge-pending',
    rejected: 'badge badge-danger',
  };

  const label = safeStatus
    ? safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)
    : 'Unknown';

  return <span className={config[safeStatus] || 'badge'}>{label}</span>;
};


const getInitials = (name) => {
  const safe = (name || '').toString().trim();
  if (!safe) return '??';

  return safe
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};


export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await testimonialsService.getAll();
      const data = response?.data || response;
      setTestimonials(Array.isArray(data) ? data : FALLBACK_TESTIMONIALS);
    } catch {
      setTestimonials(FALLBACK_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'approving' }));
    try {
      await testimonialsService.approve(id, {});
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'approved' } : t))
      );
      toast.success('Testimonial approved successfully!');
    } catch {
      toast.error('Failed to approve testimonial.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'rejecting' }));
    try {
      await testimonialsService.reject(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'rejected' } : t))
      );
      toast.success('Testimonial rejected.');
    } catch {
      toast.error('Failed to reject testimonial.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'pending').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    rejected: testimonials.filter((t) => t.status === 'rejected').length,
  };

  const filterTabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  const filtered =
    activeFilter === 'all'
      ? testimonials
      : testimonials.filter((t) => t.status === activeFilter);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                to="/admin"
                className="text-gray-500 hover:text-orange-400 transition-colors text-sm"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">/</span>
              <span className="text-orange-400 text-sm font-medium">Testimonials</span>
            </div>
            <h1 className="section-title text-3xl font-bold text-white">
              Manage Testimonials
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Review and moderate client testimonials before they appear on the public site.
            </p>
          </div>
          <button
            onClick={fetchTestimonials}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-gray-900 border-gray-800' },
            { label: 'Pending Review', value: stats.pending, color: 'text-yellow-400', bg: 'bg-yellow-900/10 border-yellow-800/30' },
            { label: 'Approved', value: stats.approved, color: 'text-emerald-400', bg: 'bg-emerald-900/10 border-emerald-800/30' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-900/10 border-red-800/30' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`card ${bg} border rounded-xl px-5 py-4`}>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-800 pb-0">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all relative -mb-px border-b-2 ${
              activeFilter === tab.key
                ? 'text-orange-400 border-orange-400 bg-orange-400/5'
                : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  activeFilter === tab.key
                    ? 'bg-orange-400/20 text-orange-300'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-800 rounded w-5/6" />
                <div className="h-3 bg-gray-800 rounded w-4/6" />
              </div>
              <div className="flex gap-3">
                <div className="h-8 bg-gray-800 rounded flex-1" />
                <div className="h-8 bg-gray-800 rounded flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <svg className="w-9 h-9 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium text-lg">No testimonials found</p>
          <p className="text-gray-600 text-sm mt-1">
            No {activeFilter !== 'all' ? activeFilter : ''} testimonials at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="card bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-black/40 group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(t.clientName)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{t.clientName}</p>
                    <p className="text-gray-500 text-xs">{t.email}</p>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>

              {/* Star Rating */}
              <StarRating rating={t.rating} />

              {/* Quote */}
              <blockquote className="mt-3 mb-4 flex-1">
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Submitted {formatDate(t.date)}
              </div>

              {/* Actions */}
              {t.status === 'pending' && (
                <div className="flex gap-2.5 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => handleApprove(t.id)}
                    disabled={!!actionLoading[t.id]}
                    className="btn-success flex-1 flex items-center justify-center gap-1.5 text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[t.id] === 'approving' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(t.id)}
                    disabled={!!actionLoading[t.id]}
                    className="btn-danger flex-1 flex items-center justify-center gap-1.5 text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[t.id] === 'rejecting' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Reject
                  </button>
                </div>
              )}

              {t.status === 'approved' && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                  <div className="flex-1 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Visible on public site
                  </div>
                  <button
                    onClick={() => handleReject(t.id)}
                    disabled={!!actionLoading[t.id]}
                    className="text-xs text-gray-600 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              )}

              {t.status === 'rejected' && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                  <div className="flex-1 flex items-center gap-2 text-red-400 text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Not displayed publicly
                  </div>
                  <button
                    onClick={() => handleApprove(t.id)}
                    disabled={!!actionLoading[t.id]}
                    className="text-xs text-gray-600 hover:text-emerald-400 transition-colors disabled:opacity-50"
                  >
                    Re-approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
