import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import WishlistModal from './components/WishlistModal';
import IntroAnimation from './components/IntroAnimation';
import './App.css';

// Lazy load non-essential routes to reduce main bundle size
const About = lazy(() => import('./pages/About'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const UserLayout = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="flex flex-col min-h-screen relative">
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
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
