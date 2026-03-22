import { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Casual', 'Formal', 'Bridal', 'Festive', 'Winter', 'Cotton'];
const FABRICS = ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Linen', 'Wool', 'Banarasi'];
const OCCASIONS = ['Casual', 'Wedding', 'Office', 'Festival', 'Daily'];
const SORTS = ['Newest First', 'Price Low-High', 'Price High-Low', 'Popular'];

const FilterSidebar = ({ filters, setFilters, isOpen, setIsOpen }) => {

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayToggle = (key, value) => {
    setFilters(prev => {
      const array = prev[key] || [];
      if (array.includes(value)) {
        return { ...prev, [key]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [key]: [...array, value] };
      }
    });
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...(filters.priceRange || [0, 10000])];
    newPriceRange[index] = Number(e.target.value);
    
    // Ensure min <= max
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) newPriceRange[0] = newPriceRange[1];
    if (index === 1 && newPriceRange[1] < newPriceRange[0]) newPriceRange[1] = newPriceRange[0];
    
    setFilters(prev => ({ ...prev, priceRange: newPriceRange }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      fabrics: [],
      occasions: [],
      priceRange: [0, 10000],
      newOnly: false,
      sort: 'Newest First'
    });
  };

  const SidebarContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between md:hidden pb-4 border-b border-border">
        <h2 className="text-xl font-serif font-medium flex items-center gap-2 text-text">
          <SlidersHorizontal size={20} />
          Filters
        </h2>
        <button onClick={() => setIsOpen(false)} className="text-muted hover:text-text p-2 bg-gray-100 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Category (Radio) */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <label key={cat} className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md transition-colors ${filters.category === cat ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-muted hover:text-text'}`}>
              <span className={`text-sm ${filters.category === cat ? 'font-medium' : ''}`}>{cat}</span>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Price Range</h3>
        <div className="px-2">
          <div className="flex justify-between text-sm font-medium text-text mb-4">
            <span>₹{(filters.priceRange?.[0] || 0).toLocaleString('en-IN')}</span>
            <span>₹{(filters.priceRange?.[1] || 10000).toLocaleString('en-IN')}</span>
          </div>
          
          <div className="relative h-1 bg-gray-200 rounded-full mb-6">
            {/* The colored track between handles */}
            <div 
              className="absolute h-full bg-primary rounded-full"
              style={{
                left: `${((filters.priceRange?.[0] || 0) / 10000) * 100}%`,
                right: `${100 - ((filters.priceRange?.[1] || 10000) / 10000) * 100}%`
              }}
            ></div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceChange(e, 0)}
              className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer pointer-events-auto z-20"
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange?.[1] || 10000}
              onChange={(e) => handlePriceChange(e, 1)}
              className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer pointer-events-auto z-20"
            />
            {/* Custom visual handles */}
            <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-primary shadow -top-1.5 pointer-events-none z-10" style={{ left: `calc(${((filters.priceRange?.[0] || 0) / 10000) * 100}% - 8px)` }}></div>
            <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-primary shadow -top-1.5 pointer-events-none z-10" style={{ left: `calc(${((filters.priceRange?.[1] || 10000) / 10000) * 100}% - 8px)` }}></div>
          </div>
        </div>
      </div>

      {/* Fabric Checkboxes */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Fabric</h3>
        <div className="space-y-3">
          {FABRICS.map(fabric => (
            <label key={fabric} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                (filters.fabrics || []).includes(fabric) ? 'bg-primary border-primary' : 'bg-surface border-border group-hover:border-primary'
              }`}>
                {(filters.fabrics || []).includes(fabric) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input
                type="checkbox"
                checked={(filters.fabrics || []).includes(fabric)}
                onChange={() => handleArrayToggle('fabrics', fabric)}
                className="hidden"
              />
              <span className={`text-sm transition-colors ${
                (filters.fabrics || []).includes(fabric) ? 'text-text font-medium' : 'text-muted group-hover:text-text'
              }`}>
                {fabric}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Occasion Checkboxes */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Occasion</h3>
        <div className="space-y-3">
          {OCCASIONS.map(occ => (
            <label key={occ} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                (filters.occasions || []).includes(occ) ? 'bg-primary border-primary' : 'bg-surface border-border group-hover:border-primary'
              }`}>
                {(filters.occasions || []).includes(occ) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input
                type="checkbox"
                checked={(filters.occasions || []).includes(occ)}
                onChange={() => handleArrayToggle('occasions', occ)}
                className="hidden"
              />
              <span className={`text-sm transition-colors ${
                (filters.occasions || []).includes(occ) ? 'text-text font-medium' : 'text-muted group-hover:text-text'
              }`}>
                {occ}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* New Arrivals Toggle */}
      <div className="pt-4 border-t border-border">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-bold uppercase tracking-widest text-text">New Arrivals Only</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={filters.newOnly || false}
              onChange={(e) => handleFilterChange('newOnly', e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${filters.newOnly ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.newOnly ? 'transform translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* Sort By */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-4">Sort By</h3>
        <div className="space-y-3">
          {SORTS.map(sort => (
            <label key={sort} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                value={sort}
                checked={filters.sort === sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-4 h-4 text-primary bg-bg border-border focus:ring-primary focus:ring-offset-bg accent-primary"
              />
              <span className={`text-sm transition-colors ${filters.sort === sort ? 'text-text font-medium' : 'text-muted group-hover:text-text'}`}>
                {sort}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-3.5 border border-border text-text font-medium text-sm uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-colors rounded"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block w-[260px] flex-shrink-0">
        <div className="sticky top-28 bg-surface border border-border rounded-xl p-6 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex items-end">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 transition-opacity" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Drawer Sliding up */}
          <div className="relative w-full bg-surface h-[85vh] rounded-t-2xl shadow-2xl flex flex-col animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="p-6 overflow-y-auto flex-grow mt-4 pb-32">
              <SidebarContent />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface shadow-[0_-10px_20px_rgba(255,255,255,0.9)] flex gap-4">
               <button
                 onClick={clearFilters}
                 className="flex-1 py-3 border border-text text-text uppercase tracking-widest text-sm font-medium rounded active:bg-gray-100"
               >
                 Clear
               </button>
               <button
                 onClick={() => setIsOpen(false)}
                 className="flex-[2] py-3 bg-text text-white uppercase tracking-widest text-sm font-medium rounded active:bg-black/80 shadow-lg shadow-black/20"
               >
                 Apply Filters
               </button>
            </div>
          </div>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
