import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit2, Copy, Trash2, Eye, EyeOff, Search, 
  GripVertical, Filter, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getProducts, deleteProduct, updateProduct, addProduct } from '../services/productService';
import { useToast } from './Toast';

const AdminProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(true);
      setProducts(data);
    } catch (error) {
      console.error(error);
      showToast('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        showToast('Product deleted successfully');
      } catch (err) {
        showToast('Error deleting product', 'error');
      }
    }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
    try {
      await updateProduct(id, { status: newStatus });
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
      showToast(`Product is now ${newStatus}`);
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDuplicate = async (product) => {
    try {
      const duplicateData = { ...product, name: `${product.name} (Copy)` };
      delete duplicateData.id;
      delete duplicateData.createdAt;
      
      const newProduct = await addProduct(duplicateData);
      setProducts([newProduct, ...products]);
      showToast(`Duplicated "${product.name}"`);
    } catch (err) {
      showToast('Error duplicating product', 'error');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Processing chain: Filter -> Sort -> Paginate
  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.fabric.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, search, categoryFilter, statusFilter, sortConfig]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [search, categoryFilter, statusFilter]);

  if (loading) {
    return <div className="p-12 text-center text-muted flex flex-col items-center">
      <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-border border-l-border rounded-full animate-spin mb-4"></div>
      Loading catalog...
    </div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
      
      {/* Toolbar */}
      <div className="p-5 border-b border-border space-y-4 sm:space-y-0 sm:flex justify-between items-center bg-gray-50/50">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-1.5 shadow-sm shrink-0">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-1.5 shadow-sm shrink-0">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-none bg-transparent focus:ring-0 cursor-pointer outline-none"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-bg text-xs uppercase tracking-wider text-muted border-b border-border">
              <th className="px-6 py-4 font-semibold w-24">Product</th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-text group transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Details <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-text group transition-colors" onClick={() => handleSort('category')}>
                <div className="flex items-center gap-1">Category <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-text group transition-colors" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">Price <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100" /></div>
              </th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border border-border shadow-sm">
                      {product.featured && <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-bl-md z-10" title="Featured"></div>}
                      <img 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&q=80'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-serif font-medium text-text text-base">{product.name}</p>
                    <p className="text-xs text-muted mt-1 font-medium">{product.fabric} &bull; {product.sizes?.join(', ')}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text font-medium">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-text font-medium font-serif">
                    {product.price ? `₹${product.price.toLocaleString()}` : <span className="text-muted italic text-xs">PoA</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {product.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          product.stock === 'in_stock' ? 'bg-green-500' :
                          product.stock === 'low_stock' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        <span className="capitalize text-muted">{product.stock?.replace('_', ' ') || 'In Stock'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleVisibility(product.id, product.status)}
                        className="text-gray-400 hover:text-text p-2 hover:bg-white rounded-md border border-transparent hover:border-border transition-all shadow-sm"
                        title={product.status === 'active' ? 'Hide Product' : 'Make Visible'}
                      >
                        {product.status === 'active' ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDuplicate(product)}
                        className="text-gray-400 hover:text-primary p-2 hover:bg-white rounded-md border border-transparent hover:border-border transition-all shadow-sm"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-white rounded-md border border-transparent hover:border-border transition-all shadow-sm"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-white rounded-md border border-transparent hover:border-border transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-muted">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                  <p className="text-lg font-serif">No products found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-muted font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedProducts.length)} of {processedProducts.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-border bg-white text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-border bg-white text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductTable;
