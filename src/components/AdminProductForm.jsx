import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Image as ImageIcon, Tag, DollarSign, Archive, LayoutList } from 'lucide-react';
import { useToast } from './Toast';
import { addProduct, updateProduct } from '../services/productService';

const CATEGORIES = ['Casual', 'Formal', 'Bridal', 'Festive', 'Winter', 'Cotton'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

const AdminProductForm = ({ initialData = null, isEdit = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Casual',
    fabric: initialData?.fabric || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    status: initialData?.status || 'active',
    stock: initialData?.stock || 'in_stock',
    featured: initialData?.featured || false,
    sizes: initialData?.sizes || [],
    colors: initialData?.colors || [],
    occasion: initialData?.occasion || [],
    images: initialData?.images?.length ? [...initialData.images, '', '', ''].slice(0, 4) : ['', '', '', '']
  });

  const [colorInput, setColorInput] = useState('');
  const [occasionInput, setOccasionInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAddTag = (e, field, inputState, setInputState) => {
    if (e.key === 'Enter' && inputState.trim()) {
      e.preventDefault();
      if (!formData[field].includes(inputState.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], inputState.trim()]
        }));
      }
      setInputState('');
    }
  };

  const removeTag = (field, tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Compress image to ensure localStorage doesn't hit quota quickly
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        handleImageUrlChange(index, dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit && initialData?.id) {
        await updateProduct(initialData.id, formData);
      } else {
        await addProduct(formData);
      }
      showToast(`Product ${isEdit ? 'updated' : 'added'} successfully!`);
      navigate('/admin/products');
    } catch (error) {
      showToast('Error saving product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
      
      {/* Left Column (Main Content) */}
      <div className="flex-1 space-y-8">
        
        {/* General Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-serif font-medium text-text mb-6 flex items-center gap-2">
            <LayoutList size={20} className="text-primary" /> General Information
          </h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Product Title *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                placeholder="e.g. Royal Blue Silk Lehenga"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Description *</label>
              <textarea
                required
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none resize-y"
                placeholder="Describe the product details, fit, and styling..."
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-serif font-medium text-text mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-primary" /> Media
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="space-y-3">
                <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-border bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative group">
                  {formData.images[idx] ? (
                    <>
                      <img 
                        src={formData.images[idx]} 
                        alt={`Preview ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.style.display = 'none'; }} 
                        onLoad={(e) => { e.target.style.display = 'block'; }}
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageUrlChange(idx, '')}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                      <UploadCloud size={24} className="mx-auto text-gray-400 mb-2" />
                      <span className="text-xs text-muted font-medium text-center">Upload or Paste URL</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(idx, e)} 
                      />
                    </label>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Or paste https://..."
                  value={formData.images[idx]}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  className="w-full p-2 text-xs bg-gray-50 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">Upload an image or paste a direct URL. The first image is the thumbnail.</p>
        </div>

        {/* Variants & Attributes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-serif font-medium text-text mb-6 flex items-center gap-2">
            <Tag size={20} className="text-primary" /> Variants & Attributes
          </h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <label key={size} className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.sizes.includes(size) ? 'bg-primary border-primary text-white shadow-md' : 'bg-gray-50 border-border text-text hover:bg-gray-100'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="hidden"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Colors (Press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                  {formData.colors.map(color => (
                    <span key={color} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-lg text-sm font-medium">
                      {color}
                      <button type="button" onClick={() => removeTag('colors', color)} className="text-blue-400 hover:text-blue-800"><X size={14} /></button>
                    </span>
                  ))}
                  {formData.colors.length === 0 && <span className="text-xs text-muted py-1 flex items-center px-1">No colors added</span>}
                </div>
                <input
                  type="text"
                  value={colorInput}
                  onChange={e => setColorInput(e.target.value)}
                  onKeyDown={e => handleAddTag(e, 'colors', colorInput, setColorInput)}
                  className="w-full p-2.5 bg-gray-50 border border-border rounded-lg outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="Type color & press enter..."
                  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Occasions (Press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
                  {formData.occasion.map(occ => (
                    <span key={occ} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-lg text-sm font-medium">
                      {occ}
                      <button type="button" onClick={() => removeTag('occasion', occ)} className="text-purple-400 hover:text-purple-800"><X size={14} /></button>
                    </span>
                  ))}
                  {formData.occasion.length === 0 && <span className="text-xs text-muted py-1 flex items-center px-1">No occasions added</span>}
                </div>
                <input
                  type="text"
                  value={occasionInput}
                  onChange={e => setOccasionInput(e.target.value)}
                  onKeyDown={e => handleAddTag(e, 'occasion', occasionInput, setOccasionInput)}
                  className="w-full p-2.5 bg-gray-50 border border-border rounded-lg outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="Type occasion & press enter..."
                  onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar) */}
      <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
        
        {/* Organization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-5">
          <h2 className="text-lg font-serif font-medium text-text flex items-center gap-2 border-b border-border pb-4">
            Organization
          </h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none font-medium"
            >
              <option value="active">Active (Published)</option>
              <option value="hidden">Hidden (Draft)</option>
            </select>
            <p className="text-xs text-muted mt-1">Hidden products won't appear on the site.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white outline-none"
            >
              <option value="" disabled>Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Fabric Type *</label>
            <input
              required
              name="fabric"
              value={formData.fabric}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
              placeholder="e.g. Silk, Cotton, Chiffon"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group p-3 border border-border rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors bg-gray-50">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary bg-bg border-border rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-text group-hover:text-yellow-800">Feature on Homepage</span>
            </label>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-5">
          <h2 className="text-lg font-serif font-medium text-text flex items-center gap-2 border-b border-border pb-4">
            Pricing & Inventory
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text flex items-center gap-1">
              <DollarSign size={16} className="text-gray-400" /> Base Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-border rounded-lg outline-none focus:border-primary focus:bg-white"
              placeholder="Leave blank for 'PoA'"
              min="0"
            />
            <p className="text-[11px] text-muted leading-tight">If omitted, price shows as "Price on Request" / "PoA".</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <label className="block text-sm font-medium text-text flex items-center gap-1">
              <Archive size={16} className="text-gray-400" /> Stock Status
            </label>
            <div className="flex flex-col gap-2">
              {[
                { val: 'in_stock', label: 'In Stock', color: 'bg-green-100 text-green-700' },
                { val: 'low_stock', label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
                { val: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.stock === opt.val ? 'border-primary ring-1 ring-primary/20 bg-blue-50/20' : 'border-border bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="stock"
                    value={opt.val}
                    checked={formData.stock === opt.val}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${opt.color}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sticky top-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 bg-accent text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all hover:bg-[#152a66] shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {isEdit ? 'Save Changes' : 'Publish Product'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full p-3 bg-white text-text border border-border rounded-xl font-medium text-sm transition-colors hover:bg-gray-50 hover:text-red-500 hover:border-red-200"
          >
            Discard
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminProductForm;
