import { useState, useEffect, useMemo } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProducts } from '../services/productService';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    fabric: 'All',
    sort: 'Newest First'
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Fabric filter
    if (filters.fabric !== 'All') {
      result = result.filter(p => p.fabric === filters.fabric);
    }

    // Sort
    switch (filters.sort) {
      case 'Price Low-High':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'Price High-Low':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'Popular':
        // Mock popular sorting (e.g. by featured first or random)
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'Newest First':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [products, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Page Header */}
      <div className="bg-white border-b border-border py-8 md:py-12 mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif font-medium text-text animate-fade-in">
            Our Collection
          </h1>
          <p className="text-muted tracking-wide text-sm md:text-base font-accent italic">
            Discover pieces crafted with elegance and tradition.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Bar: Search & Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="w-full sm:w-96">
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 bg-text text-white px-6 py-3 rounded-md uppercase tracking-wider text-sm font-medium"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters}
            isOpen={isMobileFilterOpen}
            setIsOpen={setIsMobileFilterOpen}
          />

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonLoader count={6} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="text-sm text-muted mb-6 uppercase tracking-wider">
                  Showing {filteredProducts.length} Results
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Filter size={40} />
                </div>
                <h3 className="text-2xl font-serif text-text">No pieces found</h3>
                <p className="text-muted max-w-md">
                  We couldn't find any items matching your current filters. Try adjusting your search or clearing filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ category: 'All', fabric: 'All', sort: 'Newest First' });
                  }}
                  className="mt-4 border border-text text-text px-6 py-2 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors"
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
