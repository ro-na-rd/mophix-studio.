import { Link } from 'react-router-dom';

import { useAuthStore } from '../store';

const Footer = () => {
  const { isAuthenticated } = useAuthStore();
  const year = new Date().getFullYear();

  const services = [
    'Wedding Photography',
    'Pregnancy Photoshoots',
    'Family Portraits',
    'Graduation Shoots',
    'Studio Sessions',
    'Outdoor Sessions',
  ];

  const quickLinks = !isAuthenticated
    ? [
        { to: '/', label: 'Home' },
        { to: '/portfolio', label: 'Portfolio' },
        { to: '/services', label: 'Services' },
        { to: '/blog', label: 'Blog & Stories' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/register', label: 'Book a Session' },
      ]
    : [];


  return (
    <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#080808' }}>
      {/* CTA Banner */}
      <div
        className="py-16 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, transparent 50%, rgba(249,115,22,0.06) 100%)' }}
      >
        <div className="container mx-auto px-4">
          <p className="section-tag justify-center mb-4">Ready to Begin?</p>
          <h2 className="section-title text-center mb-4">Let's Capture Your Story</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Book your session today and let Mophix Studio turn your moments into timeless art.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Book a Session
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      {!isAuthenticated && (
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-white">
                Mophix<span className="text-orange-400"> Studio</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium photography services in Kigali, Rwanda. Capturing timeless moments with cinematic precision.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-500 text-sm hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-gray-700 group-hover:bg-orange-500 group-hover:w-6 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-500 text-sm hover:text-orange-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-gray-700 group-hover:bg-orange-500 group-hover:w-6 transition-all duration-200" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">KG Kaserenge, Kigali, Rwanda</p>
                  <p className="text-gray-600 text-xs mt-0.5">KK 559 St</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <a href="tel:+250788242290" className="text-gray-400 text-sm hover:text-orange-400 transition-colors block">
                    +(250) 788 242290
                  </a>
                  <a href="tel:+250798696342" className="text-gray-600 text-xs hover:text-orange-400 transition-colors block">
                    +(250) 798 696342
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:kblteam@kbl.rw" className="text-gray-400 text-sm hover:text-orange-400 transition-colors">
                  kblteam@kbl.rw
                </a>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Mon–Sat: 8:00 AM – 6:00 PM</p>
                  <p className="text-gray-600 text-xs mt-0.5">Sunday: By Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-gray-600 text-sm text-center">
            © {year} Mophix Studio. All rights reserved. Built by{' '}
            <span className="text-orange-400">Kigali Business Lab</span>.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      )}
    </footer>
  );
};


export default Footer;
