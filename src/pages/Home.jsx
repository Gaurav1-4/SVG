import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProducts } from '../services/productService';
import { useSettings } from '../hooks/useSettings';

const GROOM_CATS = ['All', 'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama', 'Indo-Western', 'Jodhpuri', 'Achkan', 'Bandhgala'];

const MARQUEE_ITEMS = [
  'Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama',
  'Indo-Western', 'Jodhpuri Suit', 'Achkan', 'Bandhgala',
];

const HERO_CARDS = [
  { emoji: '🥻', label: 'Sherwani', cat: 'Sherwani' },
  { emoji: '🤵', label: 'Wedding Suit', cat: 'Wedding Suit' },
  { emoji: '🎩', label: 'Jodhpuri', cat: 'Jodhpuri' },
];

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || target === 0) return;
    started.current = true;
    const step = target / (duration / 16);
    let curr = 0;
    const timer = setInterval(() => {
      curr += step;
      if (curr >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(curr));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}



const Home = () => {
  const navigate = useNavigate();
  const { whatsappNumber, storeName } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const productCount = useCounter(products.length > 0 ? 200 : 0, 1400);

  useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  const scrollToCollection = () =>
    document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <div className="hero-section pt-[68px]">
        <div className="hero-grid" />

        {/* Trust bar */}
        <div className="trust-bar">
          <span>★ 4.9/5 Google Rating</span>
          <span>📍 Karawal Nagar, Delhi</span>
          <span>🕐 10:00 AM – 8:30 PM</span>
          <span>👑 The Groom's House</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left: Content */}
            <div className="flex-1 max-w-2xl lg:max-w-none">
              <div className="hero-eyebrow mb-4">New Collection 2025 · Delhi's Finest</div>
              <h1 className="hero-title">
                Dressed for<br />
                <em>Your Grand</em><br />
                Day.
              </h1>
              <p className="hero-desc mb-10">
                Sherwani, Suit, Nehru Jacket, Kurta Pajama — every style a groom could dream of.
                Crafted for the man who deserves to look extraordinary on his most important day.
              </p>
              <div className="hero-actions mb-12 flex-wrap">
                <button className="btn-primary" onClick={scrollToCollection} id="browse-collection-btn">
                  Browse Collection
                </button>
                <button
                  className="btn-outline"
                  onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${storeName}! I want to enquire about groom wear.`)}`, '_blank')}
                  id="whatsapp-enquiry-btn"
                >
                  <span className="wa-dot mr-2"></span>
                  WhatsApp Enquiry
                </button>
              </div>
              <div className="hero-stats flex-wrap">
                <div><span className="stat-num">{productCount}+</span><span className="stat-label">Products</span></div>
                <div><span className="stat-num">4.9★</span><span className="stat-label">Google</span></div>
                <div><span className="stat-num">975+</span><span className="stat-label">Customers</span></div>
                <div><span className="stat-num">15+</span><span className="stat-label">Years</span></div>
              </div>
            </div>

            {/* Right: Floating card stack */}
            <div className="hidden lg:flex flex-col items-center gap-6" style={{ opacity: 0, animation: 'fadeRight 0.7s ease forwards 0.6s' }}>
              <div className="hero-card-stack">
                {HERO_CARDS.map((card, i) => (
                  <div
                    key={card.cat}
                    className={`hcard hc${i + 1} cursor-none`}
                    onClick={() => { setActiveCategory(card.cat); scrollToCollection(); }}
                  >
                    <span className="hcard-emoji">{card.emoji}</span>
                    <span className="hcard-label">{card.label}</span>
                    <div className="hcard-border" />
                  </div>
                ))}
                <div className="hero-badge">The Groom's House</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MARQUEE ───────────────────────────────────────────── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. FILTER CHIPS ─────────────────────────────────────── */}
      <div id="collection-start" className="fchip-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {GROOM_CATS.map(cat => (
              <button
                key={cat}
                className={`fchip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. PRODUCT GRID ─────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full flex-grow">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SkeletonLoader count={8} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--muted)', marginBottom: '1rem' }}>
              No products in this category.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--gold)', cursor: 'pointer',
                borderBottom: '1px solid var(--gold)', paddingBottom: '2px',
              }}
            >
              View Complete Collection
            </button>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link to="/catalog" className="btn-outline">
              View All Arrivals →
            </Link>
          </div>
        )}
      </section>

      {/* ── 5. BRAND EDITORIAL ──────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-16"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        {/* Trust Strip */}
        <div className="brand-strip max-w-6xl mx-auto mb-20">
          {[
            { icon: '🎩', title: 'Premium Sherwanis', desc: 'Handcrafted embroidery, finest fabrics. Built for the groom who wants to make an entrance.' },
            { icon: '✂️', title: 'Custom Fitting', desc: 'Every piece tailored to your measurements. Walk in, get measured, walk out legendary.' },
            { icon: '📍', title: 'Visit Our Store', desc: '217, Street No. 5, Karawal Nagar, Delhi. Open Mon–Sat, 10AM–8:30PM.' },
            { icon: '⭐', title: '4.9 Google Rating', desc: '975+ happy customers. Trusted by families across Delhi for over 15 years.' },
          ].map(item => (
            <div key={item.title} className="brand-strip-item">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--cream)', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Brand Story */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: 'var(--cream)', fontWeight: 300, lineHeight: 1.15 }}>
              Trusted by thousands.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Loved by grooms.</em>
            </h2>
          </div>
          <div className="w-full md:w-1/2 md:border-l md:pl-10" style={{ borderColor: 'var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
              Based in the heart of Karawal Nagar, Delhi, {storeName} has been dressing
              grooms for over 15 years. From a single Sherwani to a complete wedding wardrobe,
              we guarantee the best price and unmatched quality.
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              "Quality Clothing. Best Price. Trusted Choice."
            </p>
            <button
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ${storeName}! I am interested in a custom order for groom wear. Please share more details.`)}`, '_blank')}
              className="btn-primary"
            >
              <span className="wa-dot mr-2"></span>
              Wholesale Enquiries
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
