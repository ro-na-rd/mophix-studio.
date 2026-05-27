import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/api';

const STATIC_POSTS = [
  {
    id: 1,
    slug: 'golden-hour-wedding-photography-tips',
    title: 'Mastering Golden Hour: Wedding Photography Secrets',
    excerpt:
      'Golden hour transforms ordinary scenes into cinematic masterpieces. Learn how we harness the last 60 minutes of sunlight to create breathtaking wedding portraits that couples treasure forever.',
    category: 'Wedding',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'May 18, 2026',
    readTime: '6 min read',
    image: '/assets/wedding.jpg.jpeg',
    featured: true,
  },
  {
    id: 2,
    slug: 'posing-guide-natural-portraits',
    title: 'The Art of Natural Posing for Timeless Portraits',
    excerpt:
      'Stiff, unnatural poses are the enemy of great portraits. Discover our tried-and-tested techniques to help subjects relax, laugh, and look effortlessly stunning in every frame.',
    category: 'Portrait',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: '/assets/studio.jpg.jpeg',
  },
  {
    id: 3,
    slug: 'kigali-wedding-story-amina-jean',
    title: "Amina & Jean's Kigali Love Story",
    excerpt:
      'From the hills of Kigali to the shores of Lake Kivu — a wedding story told through 400 frames of pure joy, vibrant colour, and unmistakable Rwandan elegance.',
    category: 'Wedding',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'April 28, 2026',
    readTime: '8 min read',
    image: '/assets/outdoor.jpg.jpeg',
  },
  {
    id: 4,
    slug: 'family-photography-tips',
    title: '7 Tips for Stress-Free Family Photography Sessions',
    excerpt:
      'Wrangling kids, coordinating outfits, managing expectations — family shoots can be chaotic. Here are our insider tips to ensure every family leaves with photos they love.',
    category: 'Family',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'April 15, 2026',
    readTime: '4 min read',
    image: '/assets/family.jpg.jpeg',
  },
  {
    id: 5,
    slug: 'graduation-photos-what-to-wear',
    title: 'What to Wear for Your Graduation Photos',
    excerpt:
      'Your graduation marks a defining chapter — your photos should reflect that. We break down colour choices, accessories, and styling tips to ensure you look polished and confident.',
    category: 'Graduation',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'March 30, 2026',
    readTime: '4 min read',
    image: '/assets/graduation.jpg.jpeg',
  },
  {
    id: 6,
    slug: 'event-photography-behind-scenes',
    title: 'Behind the Lens: Documenting Live Events',
    excerpt:
      'Corporate galas, music festivals, award nights — event photography demands lightning-fast reflexes and an eye for storytelling. Here\'s how we capture the energy of any event.',
    category: 'Event',
    author: 'Mophix Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80',
    date: 'March 12, 2026',
    readTime: '5 min read',
    image: '/assets/outdoor.jpg.jpeg',
  },
];
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

const ALL_CATEGORIES = ['All', ...Object.keys(CATEGORY_COLORS)];

export default function Blog() {
  const [posts, setPosts]               = useState(STATIC_POSTS);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]             = useState('');

  /* ── fetch from API ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await blogService.getAll();
        if (!cancelled && data?.length) setPosts(data);
      } catch {
        /* static fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const featured   = posts.find(p => p.featured) || posts[0];
  const rest        = posts.filter(p => p.id !== featured.id);

  const filteredRest = rest.filter(p => {
    const matchCat  = activeCategory === 'All' || p.category === activeCategory;
    const matchSrch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ══════════ HERO HEADER ══════════ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-widest uppercase mb-6">
            Journal
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Stories &{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Photography tips, behind-the-scenes stories, and the moments that move us —
            straight from the Mophix Studio team.
          </p>

          {/* search */}
          <div className="mt-10 max-w-md mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3.5
                         text-sm text-white placeholder-white/30 outline-none
                         focus:border-orange-500/50 focus:bg-white/8 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">

        {/* ══════════ FEATURED POST ══════════ */}
        {!loading && featured && (
          <Link
            to={`/blog/${featured.slug}`}
            className="group block mb-20 rounded-3xl overflow-hidden border border-white/10 bg-white/5
                       hover:border-orange-500/30 transition-all duration-500
                       shadow-2xl shadow-black/40"
          >
            <div className="grid lg:grid-cols-2">
              {/* image */}
              <div className="relative h-72 lg:h-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent lg:hidden" />
                <div className="absolute top-5 left-5">
                  <span className="px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30">
                    ★ Featured
                  </span>
                </div>
              </div>

              {/* content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className={`inline-block self-start px-3 py-1 rounded-full border text-xs font-semibold mb-4
                                  ${CATEGORY_COLORS[featured.category] || 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight
                               group-hover:text-orange-400 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-white/50 leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={featured.authorAvatar} alt={featured.author}
                         className="w-9 h-9 rounded-full object-cover border-2 border-orange-500/30" />
                    <div>
                      <p className="text-sm font-semibold text-white">{featured.author}</p>
                      <p className="text-xs text-white/40">{featured.date} · {featured.readTime}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-orange-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    Read Story
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ══════════ MAIN + SIDEBAR ══════════ */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article Grid ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">
                {activeCategory === 'All' ? 'All Articles' : activeCategory}
                <span className="text-white/30 text-base font-normal ml-2">({filteredRest.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 animate-pulse overflow-hidden">
                    <div className="h-48 bg-white/5" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-5 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded" />
                      <div className="h-3 bg-white/5 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRest.length === 0 ? (
              <div className="text-center py-20 text-white/30">
                <p className="text-4xl mb-3">✍️</p>
                <p className="text-lg">No articles found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredRest.map(post => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-8">

            {/* Categories */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                Categories
              </h3>
              <ul className="space-y-2">
                {ALL_CATEGORIES.map(cat => {
                  const count = cat === 'All'
                    ? rest.length
                    : rest.filter(p => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm
                                    font-medium transition-all duration-200
                                    ${activeCategory === cat
                                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full
                                          ${activeCategory === cat ? 'bg-orange-500/30 text-orange-300' : 'bg-white/10 text-white/40'}`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-black mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                Recent Posts
              </h3>
              <ul className="space-y-4">
                {posts.slice(0, 4).map(p => (
                  <li key={p.id}>
                    <Link
                      to={`/blog/${p.slug}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:ring-2 ring-orange-500/50 transition-all"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/80 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                          {p.title}
                        </p>
                        <p className="text-xs text-white/30 mt-1">{p.date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="relative bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl" />
              <h3 className="text-lg font-black mb-2 relative z-10">Book a Session</h3>
              <p className="text-white/50 text-sm mb-4 relative z-10">Ready to create your own story? Let's talk.</p>
              <Link
                to="/contact"
                className="inline-block w-full text-center px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400
                           text-white text-sm font-bold transition-colors shadow-lg shadow-orange-500/30 relative z-10"
              >
                Get In Touch
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Article Card ── */
function ArticleCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                 hover:border-orange-500/30 hover:bg-white/8 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10"
    >
      {/* image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-sm
                            ${CATEGORY_COLORS[post.category] || 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
            {post.category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white/70 text-xs backdrop-blur-sm">
            {post.readTime}
          </span>
        </div>
      </div>

      {/* content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-white/40 text-sm line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={post.authorAvatar} alt={post.author}
                 className="w-7 h-7 rounded-full object-cover border border-white/10" />
            <div>
              <p className="text-xs font-medium text-white/60">{post.author}</p>
              <p className="text-xs text-white/30">{post.date}</p>
            </div>
          </div>
          <span className="text-orange-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
