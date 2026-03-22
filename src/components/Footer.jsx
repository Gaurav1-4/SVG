import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Clock, Instagram } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const Footer = () => {
  const [settings, setSettings] = useState({
    storeName: 'TR TRADERS',
    whatsappNumber: '919999999999',
    address: 'Navi Mumbai, Maharashtra\nVisit our store for exclusives.'
  });

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('tr_traders_settings');
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    };
    loadSettings();
    window.addEventListener('settingsUpdated', loadSettings);
    return () => window.removeEventListener('settingsUpdated', loadSettings);
  }, []);

  return (
    <footer className="bg-[#1C1C1C] text-gray-400 py-16 border-t border-primary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="footer-brand-row block hover:opacity-90 transition-opacity">
              <div className="footer-brand-row">
                <img 
                  src="/images/tr-traders-logo.png" 
                  alt="TR TRADERS" 
                  className="footer-logo"
                />
                <div>
                  <div className="footer-brand-name">{settings.storeName.toUpperCase()}</div>
                  <div className="footer-tagline">Elegance, crafted for every woman.</div>
                </div>
              </div>
            </Link>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white px-6 py-3 rounded hover:bg-green-600 transition-colors uppercase tracking-wider text-sm font-medium w-full sm:w-auto mt-4"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-serif uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Browse All</Link></li>
              <li><Link to="/catalog?sort=newest" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div className="space-y-6">
            <h4 className="text-white font-serif uppercase tracking-wider text-sm">Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/catalog?category=Bridal" className="hover:text-primary transition-colors">Bridal Collection</Link></li>
              <li><Link to="/catalog?category=Festive" className="hover:text-primary transition-colors">Festive Wear</Link></li>
              <li><Link to="/catalog?category=Casual" className="hover:text-primary transition-colors">Casual Everyday</Link></li>
              <li><Link to="/catalog?fabric=Cotton" className="hover:text-primary transition-colors">Pure Cotton Suits</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div className="space-y-6">
            <h4 className="text-white font-serif uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>{settings.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-primary flex-shrink-0" />
                <span>+{settings.whatsappNumber.slice(0, 2)} {settings.whatsappNumber.slice(2, 7)} {settings.whatsappNumber.slice(7)}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-primary flex-shrink-0" />
                <span>Usually responds within 1 hour</span>
              </li>
            </ul>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-whatsapp hover:text-white transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-2 text-xs">
          <p>&copy; {new Date().getFullYear()} {settings.storeName.toUpperCase()}. All rights reserved.</p>
          <p className="text-gray-500 font-accent italic">Designed with &hearts; for {settings.storeName.toUpperCase()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
