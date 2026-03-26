import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';

// Custom hook to manage wishlist via localStorage
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tr_traders_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage");
    }
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(productId);
      const newWishlist = isRemoving
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('tr_traders_wishlist', JSON.stringify(newWishlist));
      
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
