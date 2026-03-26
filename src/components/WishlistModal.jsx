import { useState, useEffect } from 'react';
import { X, Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';
import { useSettings } from '../hooks/useSettings';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const location = useLocation();
  const { whatsappNumber, storeName } = useSettings();
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

  const generateBulkEnquiry = () => {
    if (savedProducts.length === 0) return;
    const items = savedProducts.map((p, i) => `${i + 1}. ${p.name} (Code: ${p.id})`).join('%0A');
    const msg = `Hello ${storeName || 'Shri Vrindavan Garments'}! I have shortlisted these items from your collection and would like to know their pricing and availability:%0A%0A${items}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

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
        <div className="p-6 overflow-y-auto flex-grow flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full flex-grow">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : savedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                {savedProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors z-20 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <button 
                  onClick={generateBulkEnquiry}
                  className="bg-whatsapp hover:bg-green-600 text-white px-8 py-3 rounded-md uppercase tracking-widest text-sm font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-1 flex items-center gap-2 animate-fade-in"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Enquire All via WhatsApp
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12 flex-grow">
              <Heart size={48} className="text-gray-300" strokeWidth={1} />
              <div className="space-y-2">
                <p className="font-serif text-2xl text-text">Your wishlist is empty</p>
                <p className="text-muted">Save your favorite styles to review later.</p>
              </div>
              <button 
                onClick={onClose}
                className="mt-4 px-6 py-2 border border-text text-text hover:bg-black hover:text-white transition-colors uppercase tracking-widest text-sm hover:-translate-y-0.5"
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
