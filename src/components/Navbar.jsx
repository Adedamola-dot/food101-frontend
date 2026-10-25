import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: user ? 'My Orders' : 'Track Order', path: user ? '/dashboard' : '/login' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path ? 'text-brand-red' : 'text-text-dark hover:text-brand-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions (Cart, Profile, Mobile Menu) */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative hidden md:flex items-center justify-center w-10 h-10 bg-brand-dark text-white rounded-xl hover:bg-brand-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center justify-center w-10 h-10 bg-gray-100 text-text-dark rounded-xl hover:bg-brand-gold hover:text-white transition-colors">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center w-10 h-10 bg-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-100 text-text-dark rounded-xl hover:bg-brand-gold hover:text-white transition-colors">
                <User size={20} />
              </Link>
            )}

            <button className="md:hidden p-2 text-text-dark hover:text-brand-gold transition-colors" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              {isMobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsMobileOpen(false)} className="block px-4 py-2 rounded-lg font-medium text-text-dark hover:bg-brand-gold hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { handleLogout(); setIsMobileOpen(false); }} className="block w-full text-left px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileOpen(false)} className="block px-4 py-2 rounded-lg font-medium text-text-dark hover:bg-brand-gold hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}