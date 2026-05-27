import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingsService, servicesService } from '../services/api';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

const SERVICES_STATIC = [
  { service_id: '1', name: 'Wedding Photography', price: 4500000, category: 'Wedding', duration_hours: 8, description: 'Cinematic wedding coverage with expert direction.' },
  { service_id: '2', name: 'Pregnancy Photoshoot', price: 1200000, category: 'Maternity', duration_hours: 2, description: 'Beautiful maternity portraits capturing this special time.' },
  { service_id: '3', name: 'Family Portrait', price: 800000, category: 'Family', duration_hours: 2, description: 'Cherish family bonds with professional portraits.' },
  { service_id: '4', name: 'Graduation Shoot', price: 600000, category: 'Graduation', duration_hours: 2, description: 'Celebrate your academic milestone in style.' },
  { service_id: '5', name: 'Studio Session', price: 400000, category: 'Studio', duration_hours: 1, description: 'Professional studio shots with expert lighting.' },
  { service_id: '6', name: 'Outdoor Session', price: 500000, category: 'Outdoor', duration_hours: 2, description: 'Natural outdoor photography in beautiful locations.' },
  { service_id: '7', name: 'Event Coverage', price: 3200000, category: 'Event', duration_hours: 6, description: 'Full event photography for all occasions.' },
];

const BookingRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [services, setServices] = useState(SERVICES_STATIC);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    service_id: serviceId || '',
    event_date: '',
    preferred_time_start: '09:00',
    preferred_time_end: '17:00',
    event_location: '',
    number_of_participants: 1,
    special_requests: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await servicesService.getAll();
        const data = res?.data || res || [];
        if (Array.isArray(data) && data.length > 0) setServices(data);
      } catch {
        // use static
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (form.service_id) {
      const found = services.find(
        (s) => String(s.service_id) === String(form.service_id)
      );
      setSelectedService(found || null);
    }
  }, [form.service_id, services]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.service_id) { toast.error('Please select a service'); return; }
    if (!form.event_date) { toast.error('Please select an event date'); return; }
    if (!form.event_location) { toast.error('Please enter the event location'); return; }

    setSubmitting(true);
    try {
      await bookingsService.create(form);
      toast.success('Booking request submitted successfully! We\'ll be in touch soon. 📸');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-tag justify-center">Book Your Session</p>
          <h1 className="section-title text-center">Request a Photography Session</h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto">
            Fill out the form below and we'll confirm your booking within 24 hours.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="form-label">Select Service *</label>
                <select
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose a service --</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name} — RWF {Number(s.price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date & Time */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    name="event_date"
                    min={minDateStr}
                    value={form.event_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="preferred_time_start"
                    value={form.preferred_time_start}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    name="preferred_time_end"
                    value={form.preferred_time_end}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="form-label">Event Location / Venue *</label>
                <input
                  type="text"
                  name="event_location"
                  value={form.event_location}
                  onChange={handleChange}
                  placeholder="e.g. Serena Hotel, Kigali / Our Studio / Outdoor Park"
                  className="form-input"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <label className="form-label">Number of Participants</label>
                <input
                  type="number"
                  name="number_of_participants"
                  min="1"
                  max="500"
                  value={form.number_of_participants}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="form-label">Special Requests or Notes</label>
                <textarea
                  name="special_requests"
                  value={form.special_requests}
                  onChange={handleChange}
                  placeholder="Any specific shots you want, preferred styles, props, themes, or other notes..."
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-4 text-base"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Submit Booking Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Service Summary */}
            {selectedService ? (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">Selected Service</h3>
                <h4 className="text-white font-semibold text-lg mb-2">{selectedService.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{selectedService.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-300">{selectedService.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-300">{selectedService.duration_hours}h session</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <span className="text-gray-300">Starting Price</span>
                    <span className="text-orange-400">RWF {Number(selectedService.price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Select a service to see the pricing summary</p>
              </div>
            )}

            {/* Info Box */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: '1', label: 'Review', desc: 'We review your request within 24 hours' },
                  { step: '2', label: 'Confirm', desc: 'We call you to confirm details & availability' },
                  { step: '3', label: 'Session', desc: 'Your photography session takes place' },
                  { step: '4', label: 'Delivery', desc: 'Edited photos delivered within 7–14 days' },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-gray-500 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400 mb-3">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-3">Call us directly to discuss your session:</p>
              <a href="tel:+250788242290" className="text-orange-400 font-semibold text-sm hover:text-orange-300 transition-colors">
                +(250) 788 242290
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingRequest;
