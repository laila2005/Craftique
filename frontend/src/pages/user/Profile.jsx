import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart, User as UserIcon, Package, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProfileData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile', err);
        setLoading(false);
      });
  }, [isAuthenticated, token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-craft-600"></div>
      </div>
    );
  }

  if (!profileData) return null;

  const { orders, favorites } = profileData;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-8 border-b border-gray-200 pb-8 flex items-center gap-6">
        <div className="h-20 w-20 bg-craft-200 rounded-full flex items-center justify-center">
          <UserIcon className="h-10 w-10 text-craft-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-craft-50 text-craft-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package className="h-5 w-5 mr-3" /> Order History
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === 'favorites' ? 'bg-craft-50 text-craft-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Heart className="h-5 w-5 mr-3" /> Saved Products
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/" className="text-craft-600 font-medium hover:underline">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Placed</p>
                          <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                          <p className="font-medium text-gray-900">EGP {parseFloat(order.total_amount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <ul className="divide-y divide-gray-100">
                          {order.items.map(item => (
                            <li key={item.id} className="py-4 flex flex-col sm:flex-row gap-4">
                              <img src={item.product?.image_url} alt={item.product?.name} className="h-20 w-20 object-cover rounded-md" />
                              <div className="flex-1">
                                <Link to={`/product/${item.product_id}`} className="font-semibold text-lg text-gray-900 hover:text-craft-600">
                                  {item.product?.name || 'Unknown Product'}
                                </Link>
                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                <p className="font-medium text-gray-900 mt-1">EGP {parseFloat(item.price).toFixed(2)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Products</h2>
              {favorites.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">You haven't saved any products yet.</p>
                  <Link to="/" className="text-craft-600 font-medium hover:underline">Explore Store</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(fav => (
                    <div key={fav.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                      <Link to={`/product/${fav.product_id}`} className="block h-48">
                        <img src={fav.product?.image_url} alt={fav.product?.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="p-4">
                        <Link to={`/product/${fav.product_id}`} className="font-semibold text-gray-900 hover:text-craft-600 truncate block">
                          {fav.product?.name}
                        </Link>
                        <p className="font-bold text-craft-900 mt-2">EGP {parseFloat(fav.product?.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
