import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import WhatsAppButton from '../components/WhatsAppButton';
import { getProducts } from '../services/productService';
import { ChevronDown } from 'lucide-react';

const categories = ['All', 'Casual', 'Formal', 'Bridal', 'Festive', 'Winter', 'Cotton'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.filter(p => activeCategory === 'All' || p.category === activeCategory).slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const scrollToCollection = () => {
    document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Luxury Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-[center_top] opacity-60 scale-105 animate-[slow-zoom_20s_ease-out_forwards]"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=90')` 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-6 pt-20">
          
          <div className="mb-4">
            <img 
              src="/images/tr-traders-logo.png" 
              alt="TR TRADERS Logo" 
              className="h-16 md:h-20 object-contain mx-auto"
            />
          </div>
          
          <p 
            className="text-white/80 tracking-[0.3em] font-medium text-[10px] md:text-sm uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            The Festive Edit 2025
          </p>

          <h1 
            className="text-[clamp(3rem,6vw,5.5rem)] font-serif text-white leading-[1.05] tracking-tight opacity-0 animate-fade-up whitespace-pre-line"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            Rooted in Tradition.{"\n"}Crafted for Today.
          </h1>

          <p 
            className="text-white/60 font-sans text-sm md:text-lg max-w-lg mx-auto opacity-0 animate-fade-up font-light tracking-wide mt-4"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            Discover hand-embroidered silks, pure cottons, and breathtaking organza pieces curated for your elegance.
          </p>

          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 opacity-0 animate-fade-up w-full"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            <button 
              onClick={scrollToCollection}
              className="bg-white text-black px-10 py-3.5 hover:bg-gray-100 transition-colors uppercase tracking-[0.2em] text-[11px] font-bold min-w-[220px]"
            >
              Explore Collection
            </button>
            <a 
              href="https://wa.me/919999999999?text=Hi!%20I%20would%20like%20to%20know%20more%20about%20your%20new%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-white border border-white/40 px-10 py-3.5 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-[11px] font-bold text-center min-w-[220px]"
            >
              Contact Stylist
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToCollection}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-white/40 hover:text-white transition-colors animate-bounce-hover focus:outline-none"
          aria-label="Scroll to collection"
        >
          <ChevronDown size={28} strokeWidth={1} />
        </button>
      </section>

      {/* 2. Category Strip */}
      <section id="collection-start" className="py-6 border-b border-border bg-white sticky top-[72px] md:top-[88px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-full uppercase tracking-wider text-[11px] font-semibold transition-colors ${
                  activeCategory === cat 
                    ? 'bg-text text-white' 
                    : 'bg-bg text-muted border border-border hover:border-text hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium">Featured Ensembles</h2>
          <Link to="/catalog" className="text-primary hover:text-accent uppercase tracking-widest text-xs font-semibold transition-colors mb-2">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <SkeletonLoader count={3} />
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted">
              <p className="font-serif text-xl italic mb-4">No exclusive pieces found for this occasion.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-primary hover:underline uppercase text-sm tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Brand Story Strip */}
      <section className="bg-text text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-serif font-medium leading-relaxed mb-6">
            TR TRADERS — Trusted by families across the city since 1995.
          </h2>
          <p className="text-primary font-accent italic text-xl md:text-2xl">
            "From the lanes of wholesale to the hearts of homes."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
