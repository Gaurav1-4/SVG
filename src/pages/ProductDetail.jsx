import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import ImageGallery from '../components/ImageGallery';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { MessageCircle, Share2, Heart, ShieldCheck, Truck } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const colorsMap = {
  'Crimson': '#DC143C',
  'Navy': '#001F5B',
  'Mustard': '#E3A908',
  'Sage': '#87AE73',
  'Ivory': '#FAF7F4',
  'Black': '#1C1C1C',
  'Rose Gold': '#C2956C',
  'Emerald': '#50C878',
  'Wine': '#722F37',
  'Teal': '#008080'
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // Auto-select first available option
        if (data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data?.colors?.length > 0) setSelectedColor(data.colors[0]);

        // Fetch related products (same category)
        if (data) {
          const allProducts = await getProducts();
          const related = allProducts
            .filter(p => p.category === data.category && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0); // Reset scroll on navigation
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SkeletonLoader count={1} className="h-[600px] w-full" />
          <div className="space-y-6">
            <SkeletonLoader count={3} />
            <SkeletonLoader count={1} className="h-40" />
            <SkeletonLoader count={2} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
          <Link to="/catalog" className="text-primary hover:underline uppercase tracking-widest text-sm">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const saved = isInWishlist(product.id);
  
  // Generate WhatsApp Message
  const waMessage = `Hi! I'm interested in the ${product.name} (Code: ${product.id}).\nCan you share more details?`;
  const waUrl = `https://wa.me/919208275274?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-bg pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-xs text-muted uppercase tracking-wider mb-8">
          <Link text-primary to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <span className="mx-2">/</span>
          <span className="text-text truncate">{product.name}</span>
        </nav>

        {/* Professional Layout: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Col: Image Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Col: Details */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-0">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-xs uppercase tracking-widest text-primary font-bold mb-2 block">
                    {product.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-serif text-text leading-tight mb-2">
                    {product.name}
                  </h1>
               </div>
               
               {/* Heart Save Button */}
               <button 
                onClick={() => toggleWishlist(product.id)}
                className="p-3 border border-border rounded-full hover:border-accent transition-colors group mt-1"
               >
                 <Heart size={22} className={`transition-colors ${saved ? 'fill-accent text-accent' : 'text-gray-400 group-hover:text-accent'}`}/>
               </button>
            </div>

            {/* Stars & Price */}
            <div className="flex items-center gap-4 mt-2 mb-6">
              <div className="flex text-[#F5C518]">
                {'★★★★★'.split('').map((star, i) => <span key={i} className="text-lg">{star}</span>)}
              </div>
              <span className="text-sm text-muted hidden sm:inline">4.8 (24 reviews)</span>
            </div>

            <p className="text-2xl font-serif text-text mb-8 border-b border-border pb-6">
              {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request'}
            </p>

            {/* Fabric & Highlights */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.fabric && (
                <span className="px-3 py-1 bg-surface border border-border text-xs uppercase tracking-wide rounded text-text">
                  Fabric: {product.fabric}
                </span>
              )}
              {product.occasions && product.occasions.map(occ =>(
                <span key={occ} className="px-3 py-1 bg-surface border border-border text-xs uppercase tracking-wide rounded text-muted">
                  {occ}
                </span>
              ))}
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text">Select Size</h3>
                  <button className="text-xs tracking-wider text-primary underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const isAvailable = product.sizes.includes(size);
                    // For mock variety, let's say XXL is sold out if it's not explicitly passed
                    if (!isAvailable) {
                      return (
                        <button key={size} disabled className="min-w-[48px] h-10 px-4 rounded border border-border bg-gray-50 text-gray-400 line-through opacity-50 cursor-not-allowed uppercase text-sm">
                          {size}
                        </button>
                      );
                    }
                    return (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-10 px-4 rounded border transition-colors uppercase text-sm font-medium ${
                          selectedSize === size ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:border-black text-text'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text mb-3">
                  Color: <span className="font-normal text-muted capitalize ml-1">{selectedColor}</span>
                </h3>
                <div className="flex gap-4">
                  {product.colors.map(color => {
                    const hex = colorsMap[color] || '#dddddd';
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${active ? 'border-accent scale-110 shadow-sm' : 'border-transparent hover:scale-105 shadow-sm'}`}
                        style={{ padding: '2px' }}
                        title={color}
                      >
                        <span 
                          className="block w-full h-full rounded-full border border-black/10"
                          style={{ backgroundColor: hex }}
                        ></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8 prose prose-sm text-muted">
              <p>{product.description || "Beautifully crafted ethnic wear blending traditional artistry with modern silhouettes. A must-have for your wardrobe."}</p>
            </div>

            {/* Actions */}
            <div className="space-y-4 mt-auto">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-14 bg-whatsapp hover:bg-green-600 text-white flex items-center justify-center gap-3 rounded-md uppercase tracking-widest text-sm font-bold transition-all shadow-lg shadow-green-600/20 group hover:shadow-green-600/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)]"></div>
                <MessageCircle size={22} />
                Enquire on WhatsApp
              </a>
              <p className="text-xs text-center text-muted">You'll be redirected to WhatsApp to chat with us directly.</p>
              
              <div className="flex items-center justify-center gap-4 pt-2">
                 <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-text transition-colors">
                   <Share2 size={16} /> Share
                 </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-border">
               <div className="flex items-center gap-3 text-muted">
                  <ShieldCheck size={24} strokeWidth={1.5} className="text-primary" />
                  <span className="text-xs uppercase tracking-wider">Authentic<br/>Quality</span>
               </div>
               <div className="flex items-center gap-3 text-muted">
                  <Truck size={24} strokeWidth={1.5} className="text-primary" />
                  <span className="text-xs uppercase tracking-wider">Worldwide<br/>Shipping</span>
               </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-border pt-20">
            <h2 className="text-2xl sm:text-3xl font-serif text-center mb-12">More from This Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
