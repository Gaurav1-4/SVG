import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';

// Custom hook to manage wishlist via localStorage
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const stored = localStorage.getItem('tr_traders_wishlist');
        if (stored) {
          setWishlist(JSON.parse(stored));
        } else {
          setWishlist([]);
        }
      } catch (e) {
        console.warn("Could not load wishlist from localStorage");
      }
    };

    // Initial load
    syncWishlist();

    // Listen to our custom local event and cross-tab storage changes
    window.addEventListener('wishlistUpdated', syncWishlist);
    window.addEventListener('storage', syncWishlist);

    return () => {
      window.removeEventListener('wishlistUpdated', syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(productId);
      const newWishlist = isRemoving
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('tr_traders_wishlist', JSON.stringify(newWishlist));
      
      // Notify other components immediately
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      if (isRemoving) {
        showToast('Removed from Wishlist');
      } else {
        showToast('Saved to Wishlist!', 'success');
      }
      
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return { wishlist, toggleWishlist, isInWishlist };
};
