import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProducts } from '../services/productService';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    fabric: 'All',
    sort: 'Newest First',
  });

  useEffect(() => {
    getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    if (filters.category !== 'All') result = result.filter(p => p.category === filters.category);

    switch (filters.sort) {
      case 'Price Low-High': result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'Price High-Low': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'Popular': result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, searchQuery, filters]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Page Header */}
      <div
        className="py-16 mt-[68px] text-center"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>
          The Groom's House
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--cream)', fontWeight: 300, lineHeight: 1.1 }}>
          The <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Complete</em> Collection
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--muted)', marginTop: '12px', letterSpacing: '0.1em' }}>
          Sherwani · Wedding Suit · Nehru Jacket · Kurta Pajama · Indo-Western · Jodhpuri · Achkan · Bandhgala
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="w-full sm:w-96">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2"
            style={{
              background: 'var(--gold)', color: '#0C0A08',
              border: 'none', padding: '12px 24px',
              fontFamily: 'var(--font-body)', fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600',
              clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
              cursor: 'pointer',
            }}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={isMobileFilterOpen}
            setIsOpen={setIsMobileFilterOpen}
          />

          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SkeletonLoader count={6} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                  Showing {filteredProducts.length} Results
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-20 text-center gap-6">
                <div style={{ fontSize: '3rem' }}>🎩</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cream)', fontWeight: 300 }}>
                  No pieces found
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--muted)', maxWidth: '360px' }}>
                  Try adjusting your search or clearing your filters to browse the full collection.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setFilters({ category: 'All', fabric: 'All', sort: 'Newest First' }); }}
                  className="btn-outline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
