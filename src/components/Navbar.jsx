import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useSettings } from '../hooks/useSettings';

const GROOM_CATS = ['Sherwani', 'Wedding Suit', 'Nehru Jacket', 'Kurta Pajama', 'Indo-Western'];

const Navbar = ({ onOpenWishlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { whatsappNumber, storeName } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/catalog' },
    { name: 'About', path: '/about' },
  ];

  const openWA = () =>
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! I visited ${storeName} website and would like to know more about your groom collection.`)}`,
      '_blank'
    );

  return (
    <nav
      className="fixed w-full z-50 transition-all duration-300"
      style={{
        height: '64px',
        background: scrolled
          ? 'rgba(255,255,255,0.98)'
          : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8E4DC',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">

          {/* Left: Brand */}
          <Link to="/" className="brand-area">
            <img
              src="/images/svg-logo.png"
              alt="Shri Vrindavan Garments"
              className="nav-logo"
              loading="eager"
              draggable="false"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div className="hidden sm:block">
              <div className="brand-name">{storeName || 'Shri Vrindavan Garments'}</div>
              <div className="brand-sub">The Groom's House · Delhi</div>
            </div>
          </Link>

          {/* Center: Category quick links */}
          <div className="nav-cats hidden lg:flex items-center space-x-1">
            {GROOM_CATS.map(cat => (
              <button
                key={cat}
                onClick={() => navigate(`/catalog?category=${cat}`)}
                className=""
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Nav links + Wishlist + WA */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={onOpenWishlist}
              className="relative"
              style={{ color: wishlist.length > 0 ? 'var(--gold)' : 'var(--muted)' }}
              title="Saved Items"
            >
              <Heart
                size={20}
                className={wishlist.length > 0 ? 'fill-current' : ''}
              />
              {wishlist.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'var(--gold)', color: '#0C0A08' }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={openWA}
              className="wa-btn-wrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--wa)',
              }}
            >
              <span className="wa-dot"></span>
              WhatsApp
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onOpenWishlist}
              className=""
              style={{ color: wishlist.length > 0 ? 'var(--gold)' : 'var(--muted)' }}
            >
              <Heart size={22} className={wishlist.length > 0 ? 'fill-current' : ''} />
              {wishlist.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'var(--gold)', color: '#0C0A08' }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className=""
              style={{ color: 'var(--muted)' }}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderBottom: '1px solid #E8E4DC',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <div className="px-6 py-6 space-y-1">
            {GROOM_CATS.slice(0, 4).map(cat => (
              <button
                key={cat}
                onClick={() => { navigate(`/catalog?category=${cat}`); setIsOpen(false); }}
                className="block w-full text-left py-3 border-b"
                style={{
                  borderColor: '#E8E4DC',
                  color: '#8A8A8A',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                {cat}
              </button>
            ))}
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-3 border-b"
                style={{
                  borderColor: '#E8E4DC',
                  color: location.pathname === link.path ? '#B8960C' : '#1A1A1A',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
