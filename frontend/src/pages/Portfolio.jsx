import { useState, useEffect } from 'react';
import { galleriesService } from '../services/api';

const STATIC_GALLERY = [
  {
    id: 1,
    title: 'Golden Hour Vows',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',
    span: 'row-span-2',
  },

  {
    id: 2,
    title: 'Timeless Elegance',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',
    span: '',
  },
  {
    id: 3,
    title: 'Garden Ceremony',
    category: 'Wedding',
    image: '/assets/outdoor.jpg.jpeg',
    span: ''
  },
  {
    id: 4,
    title: 'Golden Hour Vows',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',

    span: 'row-span-2',
  },
  {
    id: 5,
    title: 'Cap & Gown Glory',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',
    span: '',
  },
  {
    id: 6,
    title: 'Corporate Gala',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',
    span: '',
  },
  {
    id: 7,
    title: 'Golden Hour Vows',
    category: 'Wedding',
    image: '/assets/wedding.jpg.jpeg',
    span: 'row-span-2',
  },
  {
    id: 8,
    title: 'Classic Portraits',
    category: 'Portrait',
    image: '/assets/studio.jpg.jpeg',
    span: '',
  },
  {
    id: 9,
    title: 'Sunset Reception',
    category: 'Studio',
    image: '/assets/studio.jpg.jpeg',
    span: '',
  },
  {
    id: 10,
    title: 'Family Bonds',
    category: 'Family',
    image: '/assets/family.jpg.jpeg',
    span: '',
  },
  {
    id: 11,
    title: 'Achievement Unlocked',
    category: 'Graduation',
    image: '/assets/graduation.jpg.jpeg',
    span: '',
  },
  {
    id: 12,
    title: 'Festival Lights',
    category: 'Event',
    image: '/assets/wedding.jpg.jpeg',
    span: '',
  },
];

const CATEGORIES = ['All', 'Wedding', 'Portrait', 'Family', 'Event', 'Graduation', 'Maternity', 'Studio', 'Outdoor'];

const CATEGORY_COLORS = {
  Wedding:    'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Portrait:   'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Family:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Event:      'bg-green-500/20 text-green-400 border-green-500/30',
  Graduation: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Maternity:  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Studio:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Outdoor:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function Portfolio() {
  const [items, setItems]               = useState(STATIC_GALLERY);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);

  /* ── portfolio uses ONLY local STATIC_GALLERY images ── */
  useEffect(() => {
    setLoading(false);
  }, []);


  /* ── stagger card entrance ── */
  useEffect(() => {
    if (loading) return;
    setVisibleCount(0);
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= filtered.length) { clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeCategory]);

  /* ── close lightbox on Escape ── */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category === activeCategory);

  /* ── prev / next in lightbox ── */
  const lightboxIndex = lightbox ? filtered.findIndex(i => i.id === lightbox.id) : -1;
  const prevItem = lightboxIndex > 0 ? filtered[lightboxIndex - 1] : null;
  const nextItem = lightboxIndex < filtered.length - 1 ? filtered[lightboxIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ══════════ HERO HEADER ══════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Our Work
          </span>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Our{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent
                             animate-[gradientShift_4s_ease-in-out_infinite]">
              Portfolio
            </span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every frame tells a story. Browse through our carefully curated collection
            of moments captured with passion and precision.
          </p>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {[
            { value: '500+', label: 'Photos Captured' },
            { value: '8',    label: 'Categories' },
            { value: '3+',   label: 'Years Active' },
          ].map(stat => (
            <div key={stat.label} className="py-8 text-center group hover:bg-orange-500/5 transition-colors">
              <p className="text-3xl md:text-4xl font-black text-orange-400 group-hover:scale-110 transition-transform inline-block">
                {stat.value}
              </p>
              <p className="text-white/40 text-sm mt-1 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CATEGORY TABS ══════════ */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-orange-500/50 hover:text-white hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ══════════ GALLERY GRID ══════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative">
        {/* Editorial texture overlays (do not modify photo content) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="ronard-vignette" />
          <div className="ronard-grain" />
        </div>
        {/* Subtle editorial frame around the whole gallery */}
        <div className="pointer-events-none absolute inset-0 z-5">
          <div className="absolute inset-0 border border-white/5 rounded-[22px]" />
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        </div>
        <div className="relative z-10">
        {loading ? (
          /* skeleton loader */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-white/5 animate-pulse"
                style={{ height: i % 3 === 0 ? '380px' : '260px' }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No photos in this category yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                visible={idx < visibleCount}
                onClick={() => setLightbox(item)}
              />
            ))}
          </div>
        )}
      </div>
      </section>

      {/* ══════════ LIGHTBOX ══════════ */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full
                         bg-white/10 hover:bg-orange-500/30 text-white transition-colors z-10"
            >
              ✕
            </button>

            {/* image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80">
              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="w-full max-h-[75vh] object-cover"
              />
              {/* editorial caption (more minimal) */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0" />
                  <div className="relative flex flex-col gap-2 p-5">
                    <span className={`inline-flex items-center w-fit px-3 py-1 rounded-full border text-xs font-semibold ${CATEGORY_COLORS[lightbox.category] || 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                      {lightbox.category}
                    </span>
                    <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">{lightbox.title}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* prev / next */}
            <div className="flex justify-between mt-4">
              <button
                disabled={!prevItem}
                onClick={() => setLightbox(prevItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-orange-500/20
                           text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                ← Previous
              </button>
              <span className="text-white/30 text-sm self-center">
                {lightboxIndex + 1} / {filtered.length}
              </span>
              <button
                disabled={!nextItem}
                onClick={() => setLightbox(nextItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-orange-500/20
                           text-white/70 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Gallery Card ── */
function GalleryCard({ item, visible, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group relative
                  transition-all duration-500
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* image */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{ minHeight: '200px' }}
      />

      {/* hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                       flex flex-col justify-end p-5 transition-all duration-300
                       ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`inline-block self-start px-3 py-1 rounded-full border text-xs font-semibold mb-2
                          ${CATEGORY_COLORS[item.category] || 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
          {item.category}
        </span>
        <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
        <span className="text-white/50 text-xs mt-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Click to enlarge
        </span>
      </div>

      {/* corner badge always visible */}
      <div className="absolute top-3 right-3">
        <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm
                          transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}
                          ${CATEGORY_COLORS[item.category] || 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
          {item.category}
        </span>
      </div>
    </div>
  );
}
