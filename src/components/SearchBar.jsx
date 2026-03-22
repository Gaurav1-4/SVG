import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getProducts } from '../services/productService';

const SearchBar = ({ onSearch, placeholder = "Search collection..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load products for client-side search matching
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (e) {
        console.error("Failed to load products for search");
      }
    };
    fetchAll();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
        // Optional: blur input
        document.activeElement?.blur();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Debounced Search & Suggestion Logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
      
      if (query.trim().length > 1) {
        const q = query.toLowerCase();
        const matches = allProducts.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q)
        ).slice(0, 5); // Max 5 suggestions
        
        setSuggestions(matches);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [query, allProducts, onSearch]);

  const handleSuggestionClick = (productId) => {
    setShowDropdown(false);
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowDropdown(false);
      if (onSearch) onSearch(query);
    }
  };

  // Helper to highlight matching text
  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-transparent text-primary font-medium">{part}</mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl bg-surface shadow-sm text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm relative z-10"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim().length > 1 && suggestions.length > 0) setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            setSuggestions([]);
            setShowDropdown(false);
            if (onSearch) onSearch('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-20"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Live Suggestion Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden z-[60] animate-fade-up origin-top">
          <ul className="divide-y divide-border">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-4 transition-colors focus:bg-gray-50 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={suggestion.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&q=80'} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-serif text-[15px] text-text leading-tight truncate">
                      {highlightMatch(suggestion.name, query)}
                    </p>
                    <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">
                      {suggestion.category} {suggestion.fabric ? `· ${suggestion.fabric}` : ''}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
