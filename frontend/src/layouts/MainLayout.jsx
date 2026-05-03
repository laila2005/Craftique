import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
  const { cartCount } = useContext(CartContext);
  const { isAuthenticated, logout, role, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-craft-600 mr-4 cursor-pointer md:hidden" />
              <Link to="/" className="text-2xl font-bold text-craft-800 tracking-tight">Craftique</Link>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-craft-500 focus:ring-1 focus:ring-craft-500 sm:text-sm transition duration-150 ease-in-out" 
                  placeholder="Search for handmade goods..." 
                />
              </form>
            </div>

            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-1 text-sm font-medium text-craft-600 hover:text-craft-800 transition"
                  >
                    <User className="h-6 w-6 p-0.5 bg-craft-100 rounded-full" />
                    <span className="hidden sm:inline-block">Hi, {user?.name}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1 sm:hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" state={{ tab: 'orders' }} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-craft-50 hover:text-craft-700">My Profile & Orders</Link>
                      <Link to="/profile" state={{ tab: 'favorites' }} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-craft-50 hover:text-craft-700">Saved Products</Link>
                      <button 
                        onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-craft-600 hover:text-craft-800 transition flex items-center text-sm font-medium">
                  <User className="h-5 w-5 mr-1" /> Sign In / Register
                </Link>
              )}
              
              <Link to="/cart" className="text-craft-600 hover:text-craft-800 transition relative ml-4">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-craft-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-craft-900 text-craft-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-bold text-white tracking-tight mb-4 block">Craftique</span>
            <p className="text-sm">The premier marketplace for handcrafted goods, supporting artisans around the globe.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Ceramics</Link></li>
              <li><Link to="/" className="hover:text-white transition">Textiles</Link></li>
              <li><Link to="/" className="hover:text-white transition">Bath & Beauty</Link></li>
              <li><Link to="/" className="hover:text-white transition">Jewelry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Open a Shop</a></li>
              <li><Link to="/admin" className="hover:text-white transition">Seller Handbook</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
