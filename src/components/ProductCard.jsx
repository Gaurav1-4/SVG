import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import WhatsAppButton from './WhatsAppButton';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Intersection Observer for scroll-in entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const saved = isInWishlist(product.id);

  return (
    <div 
      ref={cardRef}
      className={`card-enter ${isVisible ? 'visible' : ''} group flex flex-col bg-white border border-gray-100/50 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-500 relative shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]`}
    >
      {/* Wishlist Button Overlay */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md shadow-sm transition-transform active:scale-110 ${saved ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
        style={{ transition: 'transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275), color 200ms ease' }}
        aria-label="Save to Wishlist"
      >
        <Heart size={18} className={saved ? 'fill-accent' : ''} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 block card-img">
        {/* Loading Skeleton */}
        {!imageLoaded && <div className="absolute inset-0 skeleton"></div>}
        
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML += `<div class="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-4xl font-serif text-gray-400">${product.name.charAt(0)}</span></div>`;
          }}
        />
        
        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {product.status === 'out_of_stock' ? (
            <span className="bg-white/90 backdrop-blur-md text-red-600 border border-red-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Sold Out
            </span>
          ) : product.featured && (
            <span className="bg-white/90 backdrop-blur-md text-text border border-gray-200 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> New Arrival
            </span>
          )}
          {product.fabric && (
             <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest float-left w-fit border border-white/20">
               {product.fabric}
             </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="flex-grow space-y-1.5 text-center px-2">
          <h3 className="font-serif text-[clamp(1.1rem,2vw,1.25rem)] font-normal text-text leading-snug line-clamp-2">
            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded">
              {product.name}
            </Link>
          </h3>
          
          <div className="flex flex-col items-center justify-center mt-3 gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">{product.category}</span>
            {product.price ? (
              <span className="font-serif text-primary text-xl mt-1">₹{product.price.toLocaleString('en-IN')}</span>
            ) : (
              <span className="italic text-xs text-gray-500 mt-1">Price on Request</span>
            )}
          </div>
        </div>

        {/* Action - Hidden until hover */}
        <div className="mt-0 overflow-hidden max-h-0 group-hover:max-h-14 group-hover:mt-6 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <WhatsAppButton 
            productName={product.name}
            className="w-full text-[11px] py-3.5 rounded-lg bg-text text-white hover:bg-primary shadow-none tracking-[0.15em] uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
