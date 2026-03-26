import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import WishlistModal from './components/WishlistModal';
import './App.css';

// Lazy load non-essential routes to reduce main bundle size
const About = lazy(() => import('./pages/About'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const UserLayout = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const handleOpenWishlist = () => setIsWishlistOpen(true);
    window.addEventListener('openWishlist', handleOpenWishlist);
    return () => window.removeEventListener('openWishlist', handleOpenWishlist);
  }, []);

  // Custom gold cursor — uses refs so elements are guaranteed present
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      // Slight delay on the ring for trailing effect
      setTimeout(() => {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
      }, 80);
    };

    const addHover = (e) => {
      if (e.target.closest('button, a, [role="button"], .fchip, .svg-card, .hcard')) {
        cursor.classList.add('hovered');
        ring.classList.add('hovered');
      }
    };

    const removeHover = (e) => {
      if (e.target.closest('button, a, [role="button"], .fchip, .svg-card, .hcard')) {
        cursor.classList.remove('hovered');
        ring.classList.remove('hovered');
      }
    };

    document.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', addHover, { passive: true });
    document.addEventListener('mouseout', removeHover, { passive: true });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', addHover);
      document.removeEventListener('mouseout', removeHover);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Custom cursor elements — using refs not getElementById */}
      <div ref={cursorRef} id="cursor" />
      <div ref={ringRef} id="cursor-ring" />
      <Navbar onOpenWishlist={() => setIsWishlistOpen(true)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};



function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Route>
            {/* Catch-all to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
