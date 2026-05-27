import { useState } from 'react';
import toast from 'react-hot-toast';
import { contactService } from '../services/api';

const SUBJECTS = [
  'Wedding Photography',
  'Portrait Session',
  'Family Photography',
  'Event Coverage',
  'Graduation Photos',
  'Maternity Session',
  'Corporate / Commercial',
  'Other',
];

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Studio Address',
    lines: ['KG Kaserenge, KK 559 st', 'Kigali, Rwanda'],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone Numbers',
    lines: ['+(250) 788 242 290', '+(250) 798 696 342'],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email Address',
    lines: ['kblteam@kbl.rw'],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Business Hours',
    lines: ['Mon – Sat: 8:00 AM – 7:00 PM', 'Sunday: By Appointment'],
  },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ── validation ── */
  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.subject)        e.subject = 'Please choose a subject.';
    if (!form.message.trim()) e.message = 'Message cannot be empty.';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await contactService.submit(form);
      toast.success('Message sent! We\'ll be in touch shortly. 📸', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(249,115,22,0.3)',
        },
        iconTheme: { primary: '#f97316', secondary: '#fff' },
        duration: 5000,
      });
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(239,68,68,0.3)',
        },
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ══════════ HERO HEADER ══════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Let's{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a session in mind? A question about our packages? Or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ══════════ MAIN SPLIT LAYOUT ══════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── LEFT: Contact Form (3 cols) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl font-black mb-2">Send Us a Message</h2>
              <p className="text-white/40 text-sm mb-8">We typically respond within 24 hours.</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    label="Full Name"
                    error={errors.name}
                    required
                  >
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Uwimana"
                      className={`form-input w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white
                                  placeholder-white/20 outline-none transition-all
                                  ${errors.name
                                    ? 'border-red-500/60 focus:border-red-500'
                                    : 'border-white/10 focus:border-orange-500/60 focus:bg-white/8'
                                  }`}
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    error={errors.email}
                    required
                  >
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={`form-input w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white
                                  placeholder-white/20 outline-none transition-all
                                  ${errors.email
                                    ? 'border-red-500/60 focus:border-red-500'
                                    : 'border-white/10 focus:border-orange-500/60 focus:bg-white/8'
                                  }`}
                    />
                  </FormField>
                </div>

                {/* Phone + Subject */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField label="Phone Number (optional)">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+(250) 7XX XXX XXX"
                      className="form-input w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white
                                 placeholder-white/20 outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all"
                    />
                  </FormField>

                  <FormField
                    label="Subject"
                    error={errors.subject}
                    required
                  >
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`form-input w-full bg-[#111] border rounded-xl px-4 py-3.5 text-sm outline-none transition-all
                                  appearance-none cursor-pointer
                                  ${form.subject ? 'text-white' : 'text-white/30'}
                                  ${errors.subject
                                    ? 'border-red-500/60 focus:border-red-500'
                                    : 'border-white/10 focus:border-orange-500/60'
                                  }`}
                    >
                      <option value="" disabled className="text-white/30">Select a service…</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s} className="text-white bg-[#111]">{s}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* Message */}
                <FormField
                  label="Your Message"
                  error={errors.message}
                  required
                >
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your shoot — dates, location, number of people, any special requests…"
                    className={`form-input w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white
                                placeholder-white/20 outline-none resize-none transition-all
                                ${errors.message
                                  ? 'border-red-500/60 focus:border-red-500'
                                  : 'border-white/10 focus:border-orange-500/60 focus:bg-white/8'
                                }`}
                  />
                </FormField>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-white text-base
                             bg-gradient-to-r from-orange-500 to-amber-500
                             hover:from-orange-400 hover:to-amber-400
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50
                             transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-white/25 text-xs">
                  Your information is kept private and never shared.
                </p>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Info + Map (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact cards */}
            {CONTACT_INFO.map((info, i) => (
              <div
                key={i}
                className="group flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5
                           hover:border-orange-500/30 hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/20
                               flex items-center justify-center text-orange-400 group-hover:bg-orange-500/25 transition-colors">
                  {info.icon}
                </div>
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">
                    {info.label}
                  </p>
                  {info.lines.map((line, j) => (
                    <p key={j} className="text-white text-sm font-medium leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-56 bg-white/5
                           flex items-center justify-center group hover:border-orange-500/30 transition-colors">
              {/* decorative grid */}
              <div className="absolute inset-0 opacity-20"
                   style={{
                     backgroundImage: 'linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px)',
                     backgroundSize: '32px 32px',
                   }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

              {/* pin */}
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
                <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center
                               shadow-lg shadow-orange-500/20 animate-pulse">
                  <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Mophix Studio</p>
                  <p className="text-white/40 text-xs mt-0.5">KG Kaserenge, KK 559 st, Kigali</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Kigali+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400
                             text-xs font-semibold hover:bg-orange-500/30 transition-colors"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'Instagram', href: '#', color: 'hover:text-pink-400 hover:border-pink-400/40',
                    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /> },
                  { label: 'Facebook', href: '#', color: 'hover:text-blue-400 hover:border-blue-400/40',
                    icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
                  { label: 'Twitter', href: '#', color: 'hover:text-sky-400 hover:border-sky-400/40',
                    icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-xl border border-white/10
                               text-white/40 transition-all duration-200 ${social.color}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Form Field wrapper ── */
function FormField({ label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
