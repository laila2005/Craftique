import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-craft-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-craft-800">
          <Link to="/" className="text-2xl font-bold tracking-tight">Craftique<span className="text-sm font-normal text-craft-400 ml-2">Admin</span></Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-craft-800 text-white' 
                    : 'text-craft-300 hover:bg-craft-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-craft-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-craft-300 hover:bg-craft-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
            <div className="h-8 w-8 rounded-full bg-craft-600 flex items-center justify-center text-white font-bold uppercase">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
