import { useState, useEffect } from 'react';
import { X, Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const location = useLocation();
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Force close on route change to prevent overflow locking
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetchSaved = async () => {
        setLoading(true);
        try {
          // In a real app we'd fetch only the IDs, but mock fetches all
          const all = await getProducts();
          setSavedProducts(all.filter(p => wishlist.includes(p.id)));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      if (wishlist.length > 0) {
        fetchSaved();
      } else {
        setSavedProducts([]);
        setLoading(false);
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, wishlist]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-bg w-full max-w-4xl max-h-[90vh] h-[90vh] md:h-auto md:min-h-[60vh] rounded-xl shadow-2xl flex flex-col m-4 animate-fade-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-serif text-text flex items-center gap-2">
            <Heart className="fill-accent text-accent" size={24} />
            My Wishlist
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted hover:text-text"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : savedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors z-10 shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <Heart size={48} className="text-gray-300" strokeWidth={1} />
              <div className="space-y-2">
                <p className="font-serif text-2xl text-text">Your wishlist is empty</p>
                <p className="text-muted">Save your favorite styles to review later.</p>
              </div>
              <button 
                onClick={onClose}
                className="mt-4 px-6 py-2 border border-text text-text hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm"
              >
                Browse Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
