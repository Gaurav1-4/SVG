import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell 
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import ProtectedRoute from '../ProtectedRoute';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('tr_admin');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <ProtectedRoute>
      <div className="flex bg-bg min-h-screen font-sans">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-border bg-accent text-white">
            <BrandLogo dark={true} className="scale-75 origin-left" />
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive && item.path !== '#' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-gray-50 hover:text-text'}`}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-8 shrink-0">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-text hover:text-primary">
              <Menu size={24} />
            </button>
            <div className="hidden md:block font-serif text-lg font-medium text-text">
              Admin Portal
            </div>
            <div className="flex items-center gap-5 ml-auto md:ml-0">
              <button className="text-muted hover:text-primary transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 border-l border-border pl-5">
                <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold font-serif text-sm">
                  TR
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-text leading-none">Admin User</span>
                  <span className="text-xs text-muted mt-1 leading-none">Manager</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-8">
            <Outlet />
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
