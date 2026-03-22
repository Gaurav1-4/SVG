import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminProductForm from '../../components/AdminProductForm';
import { getProductById } from '../../services/productService';

const AdminProductEdit = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(id);
          setInitialData(product);
        } catch (err) {
          setError('Failed to load product for editing');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Link to="/admin/products" className="text-primary hover:underline">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          to="/admin/products"
          className="p-2 text-muted hover:text-text hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif text-text">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted text-sm mt-1">
            {isEdit ? 'Update product details below' : 'Fill in details to add to catalog'}
          </p>
        </div>
      </div>

      <AdminProductForm initialData={initialData} isEdit={isEdit} />
    </div>
  );
};

export default AdminProductEdit;
