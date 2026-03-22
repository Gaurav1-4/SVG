import { isMockMode, db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Mock data for initial review (Phase 2 upgrades)
const mockProducts = [
  {
    id: '1',
    name: 'Indigo Blue Embroidered Suit Set',
    category: 'Cotton',
    fabric: 'Premium Cotton',
    occasion: ['Daily Wear', 'Casual'],
    description: 'An elegant indigo blue straight cut suit with delicate white geometric and floral motifs. Includes a beautiful matching printed dupatta.',
    price: 599,
    sizes: ['M', 'L', 'XL'],
    colors: ['Indigo Blue'],
    stock: 'in_stock',
    images: ['/images/suit-blue.jpg'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Viscose Glass Organza Tie-Dye Suit',
    category: 'Festive',
    fabric: 'Glass Organza',
    occasion: ['Haldi', 'Mehendi', 'Party'],
    description: 'A vibrant tie-dye pattern on luxurious glass organza. Features heavy hand-embroidered neckline with mirror and zardozi work. Paired with a solid red dupatta.',
    price: 650,
    sizes: ['S', 'M', 'L'],
    colors: ['Multi', 'Red'],
    stock: 'low_stock',
    images: ['/images/suit-tie-dye.jpg'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Raghav Lisha Premium Khatli Set',
    category: 'Formal',
    fabric: 'Silk Blend',
    occasion: ['Reception', 'Festive'],
    description: 'Sea-foam green premium suit featuring exquisite handbead and mirror work (Khatli style). Comes with a digital print dupatta. Available in multiple jewel tones.',
    price: 799,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Sea-Foam Green', 'Gold', 'Mauve', 'Rust'],
    stock: 'in_stock',
    images: ['/images/suit-khatli.jpg'],
    status: 'active',
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Dee Rathila Signature Red Silk Suit',
    category: 'Bridal',
    fabric: 'Pure Silk',
    occasion: ['Wedding', 'Reception'],
    description: 'A breathtaking deep red pure silk kameez featuring an iconic golden bow motif in heavy zari embroidery. The epitome of tradition and grace.',
    price: 899,
    sizes: ['Custom Fit'],
    colors: ['Crimson Red'],
    stock: 'in_stock',
    images: ['/images/suit-red-silk.jpg'],
    status: 'active',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Premium Print Unstitched Materials',
    category: 'Casual',
    fabric: 'Georgette Blend',
    occasion: ['Daily Wear', 'Office'],
    description: 'High-quality unstitched fabric sets featuring vibrant geometric and abstract prints. Perfect for custom tailoring.',
    price: 599,
    sizes: ['Unstitched'],
    colors: ['Blue', 'Orange', 'Pink', 'Black'],
    stock: 'in_stock',
    images: ['/images/suit-unstitched.jpg'],
    status: 'active',
    featured: false,
    createdAt: new Date().toISOString()
  }
];

const getMockProducts = () => {
  try {
    const stored = localStorage.getItem('tr_traders_products');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }
  
  localStorage.setItem('tr_traders_products', JSON.stringify(mockProducts));
  return mockProducts;
};

const saveMockProducts = (products) => {
  localStorage.setItem('tr_traders_products', JSON.stringify(products));
};

export const getProducts = async (includeHidden = false) => {
  if (isMockMode) {
    return new Promise(resolve => setTimeout(() => {
      let products = getMockProducts();
      if (!includeHidden) {
        products = products.filter(p => p.status === 'active');
      }
      resolve(products);
    }, 800));
  }
  
  try {
    // 5-second timeout for Firebase connection hangs
    const fetchDocs = getDocs(collection(db, "products"));
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    
    const querySnapshot = await Promise.race([fetchDocs, timeout]);
    
    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (!includeHidden) {
      products = products.filter(p => p.status === 'active');
    }
    return products;
  } catch (error) {
    console.warn("Firebase fetch failed or timed out. Falling back to mock data.", error);
    let products = getMockProducts();
    if (!includeHidden) {
      products = products.filter(p => p.status === 'active');
    }
    return products;
  }
};

export const getProductById = async (id) => {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = getMockProducts().find(p => p.id === id);
        if (product) resolve(product);
        else reject(new Error("Product not found"));
      }, 500);
    });
  }

  try {
    const docRef = doc(db, "products", id);
    const fetchDoc = getDoc(docRef);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000));
    
    const docSnap = await Promise.race([fetchDoc, timeout]);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such product!");
    }
  } catch (error) {
    console.warn("Firebase fetch failed or timed out. Falling back to mock data.", error);
    const product = getMockProducts().find(p => p.id === id);
    if (product) return product;
    throw new Error("Product not found");
  }
};

export const addProduct = async (productData) => {
  if (isMockMode) {
    return new Promise(resolve => {
      setTimeout(() => {
        const products = getMockProducts();
        const newProduct = { ...productData, id: `prod_${Date.now()}`, createdAt: new Date().toISOString() };
        saveMockProducts([newProduct, ...products]);
        resolve(newProduct);
      }, 800);
    });
  }
};

export const updateProduct = async (id, updates) => {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let products = getMockProducts();
        const index = products.findIndex(p => p.id === id);
        if (index > -1) {
          products[index] = { ...products[index], ...updates };
          saveMockProducts(products);
          resolve(products[index]);
        } else {
          reject(new Error("Product not found"));
        }
      }, 500);
    });
  }
};

export const deleteProduct = async (id) => {
  if (isMockMode) {
    return new Promise(resolve => {
      setTimeout(() => {
        let products = getMockProducts();
        products = products.filter(p => p.id !== id);
        saveMockProducts(products);
        resolve(true);
      }, 300);
    });
  }
};
