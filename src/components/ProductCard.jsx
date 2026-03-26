import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const heartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const saved = isInWishlist(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    if (heartRef.current) {
      heartRef.current.style.transform = 'scale(1.4)';
      setTimeout(() => {
        if (heartRef.current) heartRef.current.style.transform = 'scale(1)';
      }, 300);
    }
  };

  const openWA = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = `Hi SVG! I am interested in the ${product.name}. Can you share more details?`;
    window.open(`https://wa.me/919555835833?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      ref={cardRef}
      className={`card-enter ${isVisible ? 'visible' : ''} svg-card group`}
    >
      {/* Wishlist Heart */}
      <button
        ref={heartRef}
        onClick={handleWishlist}
        className={`card-save ${saved ? 'saved' : ''} absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center`}
        style={{
          background: saved ? 'var(--gold)' : 'rgba(20,18,16,0.8)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
          color: saved ? '#0C0A08' : 'var(--muted)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, color 0.2s',
        }}
        aria-label="Save to Wishlist"
      >
        <Heart size={16} className={saved ? 'fill-current' : ''} />
      </button>

      {/* Image Container */}
      <div className="card-img-wrap">
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        <Link to={`/product/${product.id}`} className="">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'}
            alt={product.name}
            className={`card-img-inner ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.3s ease' }}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Card Overlay */}
        <div className="card-overlay">
          <button onClick={openWA} className="card-overlay-btn">
            <span className="wa-dot"></span>
            &nbsp; Enquire on WhatsApp
          </button>
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {product.status === 'out_of_stock' ? (
            <span className="card-tag sold">Sold Out</span>
          ) : product.featured ? (
            <span className="card-tag">Featured</span>
          ) : product.isNew ? (
            <span className="card-tag">New</span>
          ) : null}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-1" style={{ background: 'var(--surface)' }}>
        <div className="card-category">{product.category}</div>
        <h3 className="card-name line-clamp-2">
          <Link to={`/product/${product.id}`} className=" hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          {product.price ? (
            <span className="card-price">₹{product.price.toLocaleString('en-IN')}</span>
          ) : (
            <span
              className="italic text-xs"
              style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
            >
              Price on Request
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
