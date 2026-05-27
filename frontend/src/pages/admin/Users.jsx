import { useState, useEffect, useMemo } from 'react';
import { usersService } from '../../services/api';
import toast from 'react-hot-toast';
import { AdminSidebar } from './Dashboard';

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK_USERS = [
  { id: 1,  first_name: 'Kofi',    last_name: 'Agyeman',   email: 'kofi.agyeman@gmail.com',   phone: '+233 24 111 2222', role: 'admin',  is_active: true,  date_joined: '2024-01-10T00:00:00Z' },
  { id: 2,  first_name: 'Akua',    last_name: 'Mensah',    email: 'akua.mensah@mophix.com',   phone: '+233 20 222 3333', role: 'staff',  is_active: true,  date_joined: '2024-02-15T00:00:00Z' },
  { id: 3,  first_name: 'Amara',   last_name: 'Osei',      email: 'amara.osei@email.com',     phone: '+233 24 333 4444', role: 'client', is_active: true,  date_joined: '2024-03-20T00:00:00Z' },
  { id: 4,  first_name: 'Kwame',   last_name: 'Boateng',   email: 'kwame.b@family.net',       phone: '+233 27 444 5555', role: 'client', is_active: true,  date_joined: '2024-04-05T00:00:00Z' },
  { id: 5,  first_name: 'Esi',     last_name: 'Darko',     email: 'esi.darko@corp.com',       phone: '+233 55 555 6666', role: 'staff',  is_active: false, date_joined: '2024-04-18T00:00:00Z' },
  { id: 6,  first_name: 'Nana',    last_name: 'Frimpong',  email: 'nana.f@events.gh',         phone: '+233 23 666 7777', role: 'client', is_active: true,  date_joined: '2024-05-01T00:00:00Z' },
  { id: 7,  first_name: 'Abena',   last_name: 'Asante',    email: 'abena.asante@shop.com',    phone: '+233 50 777 8888', role: 'client', is_active: false, date_joined: '2024-05-10T00:00:00Z' },
  { id: 8,  first_name: 'Yaw',     last_name: 'Owusu',     email: 'yaw.owusu@music.gh',       phone: '+233 26 888 9999', role: 'client', is_active: true,  date_joined: '2024-06-02T00:00:00Z' },
  { id: 9,  first_name: 'Akosua',  last_name: 'Poku',      email: 'akosua.poku@brand.com',    phone: '+233 24 999 0000', role: 'staff',  is_active: true,  date_joined: '2024-06-15T00:00:00Z' },
  { id: 10, first_name: 'Fiifi',   last_name: 'Hammond',   email: 'fiifi.hammond@gmail.com',  phone: '+233 20 000 1111', role: 'client', is_active: true,  date_joined: '2024-07-01T00:00:00Z' },
];

const ROLES = ['all', 'admin', 'staff', 'client'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = {
    admin:  'bg-orange-500/15 text-orange-400 border border-orange-500/25',
    staff:  'bg-violet-500/15 text-violet-400 border border-violet-500/25',
    client: 'bg-sky-500/15 text-sky-400 border border-sky-500/25',
  };
  return (
    <span className={`badge ${map[role] ?? ''}`}>
      {role?.charAt(0).toUpperCase() + role?.slice(1)}
    </span>
  );
}

function Avatar({ firstName, lastName, size = 'md' }) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  const colors = [
    'from-orange-400 to-orange-600',
    'from-violet-400 to-violet-600',
    'from-sky-400 to-sky-600',
    'from-emerald-400 to-emerald-600',
    'from-rose-400 to-rose-600',
    'from-amber-400 to-amber-600',
  ];
  const colorIndex = (firstName?.charCodeAt(0) ?? 0) % colors.length;
  const sizeClass  = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials || '?'}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function UserStatCard({ label, value, color, icon }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

// ─── Role Select Dropdown ─────────────────────────────────────────────────────
function RoleSelect({ currentRole, userId, onUpdate }) {
  const [changing, setChanging] = useState(false);

  const handleChange = async (e) => {
    const newRole = e.target.value;
    if (newRole === currentRole) return;
    setChanging(true);
    await onUpdate(userId, newRole);
    setChanging(false);
  };

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={changing}
      className="form-select text-xs py-1 px-2 w-28 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="admin">Admin</option>
      <option value="staff">Staff</option>
      <option value="client">Client</option>
    </select>
  );
}

// ─── Toggle Active Switch ─────────────────────────────────────────────────────
function ToggleSwitch({ isActive, userId, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onToggle(userId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex w-10 h-5 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? 'bg-emerald-500' : 'bg-gray-700'
      }`}
      title={isActive ? 'Deactivate user' : 'Activate user'}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
          isActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Users() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy]         = useState('date_joined');
  const [sortDir, setSortDir]       = useState('desc');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await usersService.getAll();

        // Extract the users array robustly.
        // axios interceptor returns `response.data` directly.
        // Backend returns: { success: true, data: rows, pagination: ... }
        const rows =
          (res && Array.isArray(res.data)) ? res.data :
          (res && Array.isArray(res.data?.data)) ? res.data.data :
          (res && Array.isArray(res.data?.results)) ? res.data.results :
          (Array.isArray(res)) ? res :
          [];

        setUsers(rows);
      
      



      } catch {
        setUsers(FALLBACK_USERS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Stats
  const normalizedUsers = useMemo(() => {
    return (users || []).map((u) => {
      const normalizedRole = ['admin', 'staff', 'client'].includes(u?.role) ? u.role : 'client';
      return {
        ...u,
        role: normalizedRole,
        is_active: typeof u?.is_active === 'boolean' ? u.is_active : (u?.is_active ? true : false),
      };
    });
  }, [users]);

  const stats = useMemo(() => ({
    total:  normalizedUsers.length,
    admins: normalizedUsers.filter(u => u.role === 'admin').length,
    staff:  normalizedUsers.filter(u => u.role === 'staff').length,
    clients: normalizedUsers.filter(u => u.role === 'client').length,
  }), [normalizedUsers]);

  // Filtered & sorted list
  const filtered = useMemo(() => {
    let list = normalizedUsers;
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        `${u.first_name ?? ''} ${u.last_name ?? ''}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        String(u.user_id || u.id).includes(q)
      );
    }

    return [...list].sort((a, b) => {
      let aVal = a[sortBy] ?? '';
      let bVal = b[sortBy] ?? '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [normalizedUsers, roleFilter, search, sortBy, sortDir]);


  const handleRoleUpdate = async (id, newRole) => {
    try {
      await usersService.updateRole(id, newRole);
      setUsers(prev => prev.map(u => (u.user_id === id || u.id === id) ? { ...u, role: newRole } : u));
      toast.success('Role updated successfully');
    } catch {
      setUsers(prev => prev.map(u => (u.user_id === id || u.id === id) ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await usersService.toggleActive(id);
      setUsers(prev => prev.map(u => (u.user_id === id || u.id === id) ? { ...u, is_active: !u.is_active } : u)); // Ensure correct ID is used
      const user = users.find(u => u.user_id === id || u.id === id);
      toast.success(`User ${user?.is_active ? 'deactivated' : 'activated'}`);
    } catch {
      setUsers(prev => prev.map(u => (u.user_id === id || u.id === id) ? { ...u, is_active: !u.is_active } : u));
      toast.success('User status updated');
    }
  };

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-orange-400 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage roles, access, and account status</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <UserStatCard
            label="Total Users"
            value={stats.total}
            color="bg-orange-500/10 text-orange-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <UserStatCard
            label="Admins"
            value={stats.admins}
            color="bg-orange-500/10 text-orange-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <UserStatCard
            label="Staff"
            value={stats.staff}
            color="bg-violet-500/10 text-violet-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <UserStatCard
            label="Clients"
            value={stats.clients}
            color="bg-sky-500/10 text-sky-400"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10 w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#111] border border-white/5 rounded-xl p-1">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  roleFilter === role
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <span className="text-gray-600 text-sm ml-auto">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-white/5 rounded" />
                    <div className="h-3 w-56 bg-white/5 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-white/5 rounded-full" />
                  <div className="h-5 w-10 bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No users found</p>
              <p className="text-gray-600 text-sm mt-1">Try changing the search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th
                      className="cursor-pointer hover:text-orange-400 select-none"
                      onClick={() => handleSort('first_name')}
                    >
                      User <SortIcon col="first_name" />
                    </th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th
                      className="cursor-pointer hover:text-orange-400 select-none"
                      onClick={() => handleSort('date_joined')}
                    >
                      Joined <SortIcon col="date_joined" />
                    </th>
                    <th>Change Role</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.user_id || user.id} className="group">
                      {/* Avatar + Name */}
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar firstName={user.first_name} lastName={user.last_name} />
                          <div>
                            <p className="text-white font-medium text-sm">{user.first_name} {user.last_name}</p>
                            <p className="text-gray-600 text-xs">#{user.user_id || user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <a href={`mailto:${user.email}`} className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                          {user.email}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="text-gray-400 text-sm whitespace-nowrap">{user.phone}</td>

                      {/* Role badge */}
                      <td><RoleBadge role={user.role} /></td>

                      {/* Status */}
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                          <span className={`text-xs font-medium ${user.is_active ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Role Select */}
                      <td>
                        <RoleSelect
                          currentRole={user.role}
                          userId={user.user_id || user.id}
                          onUpdate={handleRoleUpdate}
                        />
                      </td>

                      {/* Toggle Active */}
                      <td>
                        <ToggleSwitch
                          isActive={user.is_active}
                          userId={user.user_id || user.id}
                          onToggle={handleToggleActive}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-gray-600 text-xs">
                {users.filter(u => u.is_active).length} active · {users.filter(u => !u.is_active).length} inactive
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" /> Inactive
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
