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
    <div className="flex flex-col min-h-screen bg-bg">
      {/* 1. Asymmetrical Editorial Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-bg">
        {/* Left Side: Typography & CTA */}
        <div className="w-full md:w-5/12 lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-16 z-20 bg-bg">
          
          <div className="mb-10 hero-logo-wrap text-left">
            <img 
              src="/images/tr-traders-logo.png" 
              alt="TR TRADERS Logo" 
              className="h-14 md:h-16 object-contain"
            />
          </div>
          
          <p 
            className="text-primary tracking-[0.4em] font-sans font-semibold text-[10px] md:text-xs uppercase opacity-0 animate-fade-up mb-6 border-l-2 border-primary pl-4"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            The Festive Edit 2025
          </p>

          <h1 
            className="text-[clamp(3.5rem,7vw,6.5rem)] font-serif text-text leading-[1] tracking-tight opacity-0 animate-[letterIn_1s_ease-out_forwards] whitespace-pre-line"
            style={{ animationDelay: '0.4s' }}
          >
            Timeless.{"\n"}Elegance.
          </h1>

          <p 
            className="text-muted font-sans text-sm md:text-base max-w-sm opacity-0 animate-fade-up font-light tracking-wide mt-8 leading-relaxed"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            Discover our curated collection of hand-embroidered silks, pure cottons, and breathtaking designer organza suites tailored for the modern traditionalist.
          </p>

          <div 
            className="flex flex-col sm:flex-row items-start gap-5 pt-12 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            <button 
              onClick={scrollToCollection}
              className="bg-text text-white px-10 py-4 hover:bg-black transition-all duration-300 uppercase tracking-[0.25em] text-[11px] font-bold min-w-[200px]"
            >
              The Collection
            </button>
            <a 
              href="https://wa.me/919208275274?text=Hi!%20I%20would%20like%20to%20know%20more%20about%20your%20new%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent text-text border-b border-text/20 pb-1 hover:border-primary transition-all duration-300 uppercase tracking-[0.2em] text-[11px] font-bold mt-2 sm:mt-0 sm:self-center"
            >
              Enquire Stylist
            </a>
          </div>
        </div>

        {/* Right Side: Editorial Image Container */}
        <div className="w-full md:w-7/12 lg:w-1/2 h-[60vh] md:h-screen relative overflow-hidden group">
          <div className="absolute inset-0 bg-text/10 z-10 transition-opacity duration-700 group-hover:bg-transparent"></div>
          <img 
            src="https://images.unsplash.com/photo-1584282433555-c49fd0b21e90?w=1200&q=90" 
            alt="Luxury Ethnic Wear Fabric"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
          {/* Subtle artistic framing */}
          <div className="absolute inset-6 border border-white/20 z-20 pointer-events-none hidden md:block"></div>
        </div>
      </section>

      {/* 2. Elegant Text-Link Category Menu */}
      <section id="collection-start" className="py-12 border-b border-border bg-bg sticky top-[72px] md:top-[88px] z-30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth relative px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative flex-shrink-0 py-2 uppercase tracking-[0.15em] text-[11px] font-medium transition-colors hover:text-text group ${
                  activeCategory === cat ? 'text-text' : 'text-muted'
                }`}
              >
                {cat}
                {/* Animated Gold Underline */}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${
                  activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Editorial Product Grid (More spacing, cleaner background) */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex-grow relative bg-bg">
        {/* Subtle background texture class applied implicitly on body, keeps files clean */}
        
        <div className="flex flex-col items-center justify-center mb-16 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-normal text-text">Signature Pieces</h2>
          <div className="w-12 h-[1px] bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {loading ? (
            <SkeletonLoader count={4} />
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted">
              <p className="font-serif text-2xl italic mb-6">The collection corresponding to this aesthetic is currently being curated.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-primary hover:text-text uppercase tracking-[0.2em] text-xs font-bold transition-colors border-b border-primary/30 pb-1 hover:border-text"
              >
                View Complete Anthology
              </button>
            </div>
          )}
        </div>
        
        {products.length > 0 && (
          <div className="mt-20 flex justify-center">
            <Link to="/catalog" className="border border-text text-text px-12 py-4 hover:bg-text hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-[11px] font-bold">
              View All Arrivals
            </Link>
          </div>
        )}
      </section>

      {/* 4. Magazine-Style Brand Editorial */}
      <section className="bg-surface py-32 px-6 lg:px-16 border-t border-border overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-10 -left-6 text-[8rem] font-serif text-border/40 leading-none select-none z-0">"</div>
            <h2 className="text-[clamp(2.2rem,4vw,3.5rem)] font-serif font-normal text-text leading-[1.15] relative z-10">
              Trusted by families across the city since 1995.
            </h2>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col space-y-8 border-l border-border pl-8 lg:pl-16">
            <p className="text-muted font-sans font-light text-base leading-relaxed">
              We started our journey in the bustling lanes of the wholesale textile market. Our philosophy has remained unchanged: bringing the pinnacle of traditional craftsmanship and modern sophisticated design directly from the looms to the hearts of your homes.
            </p>
            <p className="text-primary font-serif italic text-2xl md:text-3xl">
              "Every fabric tells a story of heritage."
            </p>
            <div>
              <a 
                href="/about"
                className="text-text hover:text-primary uppercase tracking-[0.2em] text-[11px] font-bold transition-all border-b border-text/20 pb-1 hover:border-primary inline-block"
              >
                Read Our Story
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
