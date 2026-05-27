import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', exact: true },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/services', label: 'Services' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  // Hide the global public navbar when viewing admin or staff dashboard pages
  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/staff');
  if (isDashboardRoute) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors"
            >
              Mophix<span className="text-orange-400"> Studio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-orange-400 bg-orange-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}


          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 text-sm text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/10 transition-all duration-200"
                  >
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'client' && (
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    My Bookings
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-semibold text-xs">
                    {user?.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>{user?.first_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 border border-white/10 rounded-lg hover:border-red-500/30 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#111111' }}>
              <nav className="flex flex-col p-2">
                {!isAuthenticated &&
                  navLinks.map(({ to, label, exact }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={exact}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-orange-400 bg-orange-500/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}

                <div className="border-t border-white/5 mt-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-orange-400 rounded-xl hover:bg-orange-500/10"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-300 rounded-xl hover:bg-white/5"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 rounded-xl hover:bg-red-500/10"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-2 pt-2">
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="btn-secondary text-center justify-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="btn-primary text-center justify-center"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
