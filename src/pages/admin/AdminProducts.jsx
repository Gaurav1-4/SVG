import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminProductTable from '../../components/AdminProductTable';

const AdminProducts = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-text">Products</h1>
          <p className="text-muted text-sm mt-1">Manage your entire catalog</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="flex items-center gap-2 bg-text text-white px-4 py-2 rounded text-sm hover:bg-black transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <AdminProductTable />
    </div>
  );
};

export default AdminProducts;
