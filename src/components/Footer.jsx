import { useNavigate } from 'react-router-dom';

const GROOM_CATS = [
  'Sherwani', 'Wedding Suit', 'Nehru Jacket',
  'Kurta Pajama', 'Indo-Western', 'Jodhpuri'
];

const Footer = () => {
  const navigate = useNavigate();

  const setFilter = (cat) => {
    navigate(`/catalog?category=${cat}`);
    window.scrollTo(0, 0);
  };

  const openWA = (text) =>
    window.open(`https://wa.me/919555835833?text=${encodeURIComponent(text)}`, '_blank');

  return (
    <footer className="svg-footer" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Column 1: Brand */}
          <div>
            <img src="/images/svg-logo.png" alt="SVG Logo" className="w-14 h-14 object-contain mb-5" />
            <div
              className="mb-1 text-lg font-semibold tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              Shri Vrindavan Garments
            </div>
            <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--muted)' }}>
              The Groom's House — Delhi's finest destination
            </p>
            <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
              for men's wedding & occasion wear.
            </p>
            <button
              onClick={() => openWA("Hello SVG! I want to enquire about groom wear collection.")}
              className="wa-btn-wrap"
              style={{
                background: 'var(--wa)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: '600',
                cursor: 'pointer',
                clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
              }}
            >
              <span className="wa-dot"></span>
              WhatsApp Us
            </button>
          </div>

          {/* Column 2: Collection */}
          <div>
            <h4
              className="text-sm tracking-widest uppercase mb-5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              Collection
            </h4>
            <ul className="space-y-3 text-xs">
              {GROOM_CATS.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setFilter(cat)}
                    className=" transition-colors hover:text-gold"
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Visit Us */}
          <div>
            <h4
              className="text-sm tracking-widest uppercase mb-5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              Visit Us
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <p>217, Street No. 5</p>
              <p>Shaheed Bhagat Singh Colony</p>
              <p>Karawal Nagar, Delhi — 110090</p>
              <p className="mt-4 flex items-center gap-2">📞 095558 35833</p>
              <p className="flex items-center gap-2">🕐 Mon–Sat: 10:00 AM – 8:30 PM</p>
              <p className="flex items-center gap-2">📦 Wholesale & Retail Both</p>
            </div>
          </div>

          {/* Column 4: Reviews */}
          <div>
            <h4
              className="text-sm tracking-widest uppercase mb-5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              Customer Reviews
            </h4>
            <div className="text-xl tracking-widest mb-1" style={{ color: 'var(--gold)' }}>★★★★★</div>
            <div
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              4.9 / 5
            </div>
            <div className="text-xs mb-4">975 Google Reviews</div>
            <div className="space-y-2 text-xs italic opacity-60">
              <p>"Best price and very good quality"</p>
              <p>"Very cheap and best prices, great staff"</p>
              <p>"Totally happy customer!"</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)', opacity: 0.6 }}
        >
          <p>© 2025 Shri Vrindavan Garments · Karawal Nagar, Delhi</p>
          <p className="mt-2 md:mt-0">Men's Wedding & Occasion Wear · Wholesale & Retail</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
