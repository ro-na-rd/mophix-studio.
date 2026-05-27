import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { bookingsService, dashboardService, usersService } from '../../services/api';
import toast from 'react-hot-toast';

// ─── Sidebar Nav ────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Dashboard',    path: '/admin',            icon: HomeIcon },
  { label: 'Galleries',    path: '/admin/galleries',  icon: GalleryIcon },
  { label: 'Bookings',     path: '/admin/bookings',   icon: CalendarIcon },
  { label: 'Testimonials', path: '/admin/testimonials', icon: StarIcon },
  { label: 'Inquiries',    path: '/admin/inquiries',  icon: MailIcon },
  { label: 'Blog',         path: '/admin/blog',       icon: EditIcon },
  { label: 'Users',        path: '/admin/users',      icon: UsersIcon },
];

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function GalleryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
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

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_STATS = {
  total_bookings:  47,
  pending_bookings: 8,
  total_galleries: 12,
  total_clients:   142,
  total_users:    156,
};

const FALLBACK_BOOKINGS = [
  { id: 1, client_name: 'Amara Osei',      service: 'Wedding Photography',  event_date: '2026-06-14', status: 'confirmed' },
  { id: 2, client_name: 'Kwame Mensah',    service: 'Portrait Session',     event_date: '2026-06-18', status: 'pending'   },
  { id: 3, client_name: 'Esi Agyeman',     service: 'Corporate Event',      event_date: '2026-06-22', status: 'completed' },
  { id: 4, client_name: 'Nana Boateng',    service: 'Family Portraits',     event_date: '2026-07-01', status: 'pending'   },
  { id: 5, client_name: 'Abena Frimpong',  service: 'Product Photography',  event_date: '2026-07-05', status: 'cancelled' },
];

// ─── AdminSidebar ─────────────────────────────────────────────────────────────
export function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    if (pathname === path) return true;
    if (path !== '/admin' && pathname.startsWith(`${path}/`)) return true;
    if (path === '/admin' && pathname.startsWith('/admin')) return true;
    return false;
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-wider">MOPHIX</p>
          <p className="text-orange-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = isActivePath(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`${isActive ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
                <Icon />
              </span>
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile at bottom */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, trend, trendLabel }) {
  return (
    <div className="card group hover:border-orange-500/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value?.toLocaleString() ?? '—'}</p>
      {trendLabel && <p className="text-gray-600 text-xs mt-1">{trendLabel}</p>}
    </div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickAction({ label, to, icon, description }) {
  return (
    <Link to={to} className="card hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 group flex flex-col gap-3">
      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-all">
        {icon}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{label}</p>
        <p className="text-gray-500 text-xs mt-0.5">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-orange-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Go <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats]           = useState(null);
  const [bookings, setBookings]     = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [now, setNow]               = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, bookingsRes, usersRes] = await Promise.all([
          dashboardService.getStats(),
          bookingsService.getAll({ limit: 5, sort: '-created_at' }),
          usersService.getAll({ limit: 5, sort: '-date_joined' }),
        ]);

        // Parse stats correctly from the nested data property
        const statData = statsRes.data?.data ?? statsRes.data ?? statsRes;
        setStats(statData);

        setBookings(
          bookingsRes.data?.results ??
          bookingsRes.data?.data?.results ??
          bookingsRes.data?.data ??
          bookingsRes.data ??
          FALLBACK_BOOKINGS
        );

        // users.controller returns: { success: true, data: rows, pagination: ... }
        // axios interceptor may unwrap depending on success response structure.
        const recent =
          usersRes?.data?.data ??
          usersRes?.data?.results ??
          usersRes?.data ??
          [];

        setRecentUsers(Array.isArray(recent) ? recent : []);

      } catch {
        setStats(FALLBACK_STATS);
        setBookings(FALLBACK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats?.bookings?.total ?? stats?.total_bookings,

      color: 'bg-orange-500/10 text-orange-400',
      trend: 12,
      trendLabel: 'vs last month',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Requests',
      value: stats?.bookings?.byStatus?.find?.(x => x.status === 'pending')?.count ?? stats?.pending_bookings,

      color: 'bg-amber-500/10 text-amber-400',
      trend: -3,
      trendLabel: 'needs attention',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Published Galleries',
      value: stats?.total_galleries ?? stats?.galleries?.total,
      color: 'bg-violet-500/10 text-violet-400',
      trend: 8,
      trendLabel: 'new this month',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Registered Clients',
      value: stats?.users?.clients ?? stats?.total_clients ?? stats?.total_users ?? 0,
      color: 'bg-emerald-500/10 text-emerald-400',
      trend: 21,
      trendLabel: 'active in system',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      label: 'Upload Gallery',
      to: '/admin/galleries',
      description: 'Add new photos & albums',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>,
    },
    {
      label: 'Manage Bookings',
      to: '/admin/bookings',
      description: 'Review & update bookings',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
    },
    {
      label: 'View Inquiries',
      to: '/admin/inquiries',
      description: 'Respond to messages',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
    },
    {
      label: 'Manage Blog',
      to: '/admin/blog',
      description: 'Write & publish articles',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] pt-20">
      <AdminSidebar />

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back,{' '}
              <span className="text-orange-400">{user?.first_name ?? 'Admin'}</span> 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-white text-xl font-bold tabular-nums">{formattedTime}</p>
            <p className="text-gray-500 text-xs mt-0.5">Local time</p>
          </div>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-white/5 mb-4" />
                <div className="h-3 w-24 bg-white/5 rounded mb-2" />
                <div className="h-8 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Clients Section */}
          <div className="lg:col-span-1 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">New Clients</h2>
              <Link to="/admin/users" className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors">
                All Users
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.slice(0, 5).map((u) => (
                  <div key={u.user_id || u.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{u.first_name} {u.last_name}</p>
                      <p className="text-gray-500 text-[11px] truncate">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-[10px]">
                        {new Date(u.date_joined || u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${u.is_active ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-xs italic">No users found in system</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions (Reorganized) */}
          <div className="lg:col-span-2">
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <QuickAction key={action.to} {...action} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Recent Bookings</h2>
            <Link to="/admin/bookings" className="btn-secondary text-xs py-1.5 px-3">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Event Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(bookings.length > 0 ? bookings : FALLBACK_BOOKINGS).map((booking) => (
                  <tr key={booking.booking_id || booking.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {booking.client_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-white">{booking.client_name}</span>
                      </div>
                    </td>
                    <td className="text-gray-400">{booking.service}</td>
                    <td className="text-gray-400">
                      {new Date(booking.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                    <td>
                      <Link
                        to={`/admin/bookings`}
                        className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && !loading && (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <CalendarIcon />
              </div>
              <p className="text-gray-500 text-sm">No recent bookings</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
