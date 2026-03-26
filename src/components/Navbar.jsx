import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Youtube, Instagram, Linkedin, MapPin } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Navbar = ({ onOpenWishlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { whatsappNumber, storeName } = useSettings();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (isOpen) setIsOpen(false); // Close mobile menu on scroll
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  // Determine if we need the transparent theme (only on Home page hero ideally)
  const isHome = location.pathname === '/';
  
  // Dynamic styling based on scroll & page
  const navBg = scrolled ? 'rgba(26,26,26,0.95)' : isHome ? 'transparent' : 'rgba(26,26,26,0.95)';
  const textColor = scrolled ? 'text-white/90' : isHome ? 'text-white/90' : 'text-white/90';
  const logoScale = scrolled ? 'scale-75 translate-y-2' : 'scale-100 translate-y-4';

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'WOMEN', path: '#' },
    { name: 'MEN', path: '/catalog' },
    { name: 'CONTACT US', path: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Youtube, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500`}
        style={{
          background: navBg,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-20 md:h-24 flex items-center justify-between relative">
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${textColor} p-2 -ml-2`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* LEFT: Navigation Links (Desktop) */}
          <div className={`hidden md:flex items-center gap-8 ${textColor}`}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="text-xs lg:text-[13px] tracking-[0.15em] font-medium hover:text-gold transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CENTER: Breaking out Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 md:top-6 z-50 flex flex-col items-center">
            <Link 
              to="/" 
              className={`relative block rounded-full transition-transform duration-500 origin-top shadow-[0_4px_30px_rgba(0,0,0,0.3)] ${logoScale}`}
            >
              <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/60 scale-105 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/30 scale-110 pointer-events-none"></div>
              <img 
                src="/images/svg-logo.png" 
                alt={storeName} 
                className="w-20 h-20 md:w-28 md:h-28 rounded-full object-contain bg-[#1A1A1A] p-1 shadow-2xl"
              />
            </Link>
          </div>

          {/* RIGHT: Socials & Reach Us */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className={`hidden lg:flex items-center gap-3 ${textColor}`}>
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-gold hover:text-white transition-all shadow-md transform hover:scale-110"
                >
                  <social.icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
            
            <button 
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hello! I want to visit the store.`, '_blank')}
              className="bg-white text-[#1A1A1A] px-4 md:px-6 py-2.5 md:py-3 rounded hover:bg-white/90 transition-all font-medium text-xs md:text-[11px] tracking-[0.15em] flex items-center gap-2 shadow-lg uppercase"
            >
              <MapPin size={16} className="text-[#1A1A1A]" />
              Reach Us
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-[#1A1A1A] border-t border-white/10 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[400px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-6 py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="py-4 border-b border-white/5 text-white/90 text-xs tracking-[0.2em] uppercase font-medium hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="py-4 flex gap-4">
               {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from jumping when not on Home page (since transparent nav overlays content) */}
      {!isHome && <div className="h-20 md:h-24 bg-[#1A1A1A]"></div>}
    </>
  );
};

export default Navbar;
