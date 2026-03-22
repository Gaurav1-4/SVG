import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Tags, 
  AlertCircle, 
  Plus, 
  TrendingUp, 
  Eye, 
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { getProducts } from '../../services/productService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    total: 0, 
    categories: 0,
    active: 0,
    attention: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const prodData = await getProducts(true);
        const uniqueCats = new Set(prodData.map(p => p.category)).size;
        
        const active = prodData.filter(p => p.status === 'active').length;
        const attention = prodData.filter(p => p.stock === 'low_stock' || p.stock === 'out_of_stock' || p.status === 'hidden').length;
        
        // Sort by newest for recent activity simulation
        const recent = [...prodData].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);

        setStats({ 
          total: prodData.length, 
          categories: uniqueCats,
          active,
          attention,
          recentProducts: recent
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-text font-medium">Dashboard Overview</h1>
          <p className="text-muted text-sm mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/" 
            target="_blank"
            className="px-4 py-2 text-sm border border-border bg-white text-text rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors font-medium shadow-sm"
          >
            <Eye size={16} /> View Store
          </Link>
          <Link 
            to="/admin/products/new" 
            className="flex items-center gap-2 bg-text text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors shadow-sm font-medium"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-border relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Products</p>
              <h2 className="text-3xl font-serif mt-2 text-text">{loading ? '-' : stats.total}</h2>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Package size={22} />
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-4 font-medium"><TrendingUp size={14} /> +4 this week</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-border relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Active Listings</p>
              <h2 className="text-3xl font-serif mt-2 text-text">{loading ? '-' : stats.active}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
              <Eye size={22} />
            </div>
          </div>
          <p className="text-xs text-muted flex items-center gap-1 mt-4 font-medium">Visible to customers</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-border relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Categories</p>
              <h2 className="text-3xl font-serif mt-2 text-text">{loading ? '-' : stats.categories}</h2>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
              <Tags size={22} />
            </div>
          </div>
          <p className="text-xs text-muted flex items-center gap-1 mt-4 font-medium">Across the store</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-border relative overflow-hidden group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Require Attention</p>
              <h2 className="text-3xl font-serif mt-2 text-text">{loading ? '-' : stats.attention}</h2>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              <AlertCircle size={22} />
            </div>
          </div>
          <p className="text-xs text-orange-600 flex items-center gap-1 mt-4 font-medium">Low stock or hidden</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity / Products */}
        <div className="bg-white rounded-xl shadow-sm border border-border lg:col-span-2 flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-serif font-medium text-lg text-text">Recently Added Products</h3>
            <Link to="/admin/products" className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-1 overflow-auto">
            {loading ? (
              <div className="p-10 text-center text-muted text-sm">Loading activity...</div>
            ) : stats.recentProducts.length > 0 ? (
              <ul className="divide-y divide-border">
                {stats.recentProducts.map((p) => (
                  <li key={p.id} className="p-4 hover:bg-gray-50 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{p.name}</p>
                      <p className="text-xs text-muted mt-0.5">{p.category} &bull; {p.fabric}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 text-center text-muted text-sm border-2 border-dashed border-gray-100 m-5 rounded-lg flex flex-col items-center justify-center">
                <Package size={32} className="text-gray-300 mb-3" />
                <p>No products added yet.</p>
                <Link to="/admin/products/new" className="text-primary hover:underline mt-2">Start adding products</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="bg-accent rounded-xl shadow-sm text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="p-6 relative z-10">
              <h3 className="font-serif text-xl font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                Connect with our support team to optimize your store, add new features, or handle technical inquiries.
              </p>
              <button className="w-full bg-white text-accent px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
                Contact Support
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border p-5">
            <h3 className="font-serif font-medium text-lg text-text mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/admin/products" className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-gray-50 group transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-medium text-text">Manage Inventory</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-text transition-colors" />
              </Link>
              <Link to="/admin/orders" className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border hover:bg-gray-50 group transition-all">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 text-purple-600 p-2 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ShoppingCart size={18} />
                  </div>
                  <span className="text-sm font-medium text-text">View Enquiries</span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-text transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
