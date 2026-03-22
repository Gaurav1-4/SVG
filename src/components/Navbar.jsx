import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { BrandLogo } from './BrandLogo';

const Navbar = ({ onOpenWishlist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/catalog' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="brand-logo-link">
            <img 
              src="/images/tr-traders-logo.png" 
              alt="TR TRADERS" 
              className="nav-logo"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Adjust link color based on scroll and page (Hero has dark BG)
              const isDarkPage = location.pathname === '/' && !scrolled;
              const linkColor = isDarkPage ? 'text-gray-300 hover:text-white' : 'text-text hover:text-primary';
              const activeColor = location.pathname === link.path ? (isDarkPage ? 'text-white font-medium' : 'text-primary font-medium') : '';
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm uppercase tracking-wider transition-colors ${linkColor} ${activeColor}`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Wishlist Link */}
            <button
              onClick={onOpenWishlist}
              className={`flex items-center gap-1.5 transition-colors relative group ${scrolled || location.pathname !== '/' ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`}
              title="Saved Items"
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-accent text-accent" : ""} />
              {wishlist.length > 0 && <span className="font-medium">{wishlist.length}</span>}
              <span className="sr-only">Wishlist</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors focus:outline-none ${scrolled || location.pathname !== '/' || isOpen ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg shadow-md border-t border-border animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-center text-lg uppercase tracking-wider py-3 border-b border-border/50 ${
                  location.pathname === link.path ? 'text-primary font-medium' : 'text-text'
                }`}
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
