import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zip: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  if (cart.length === 0 && !showSuccessPopup) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.country} ${formData.zip}`,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
      };

      const response = await axios.post('http://127.0.0.1:8000/api/checkout', payload);
      
      if (response.status === 201) {
        clearCart();
        setShowSuccessPopup(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while processing your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full relative">
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all text-center animate-fade-in-up">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h3>
            <p className="text-gray-600 mb-8">Your handmade items will be on their way soon.</p>
            <button 
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/');
              }}
              className="w-full bg-craft-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-craft-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-craft-900 mb-8 border-b border-craft-200 pb-2">
        Checkout
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact & Shipping Details</h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              required type="text" name="name" 
              value={formData.name} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              required type="email" name="email" 
              value={formData.email} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input 
              required type="text" name="address" 
              value={formData.address} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input 
              required type="text" name="city" 
              value={formData.city} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input 
              required type="text" name="zip" 
              value={formData.zip} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input 
              required type="text" name="country" 
              value={formData.country} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <span className="text-xl font-medium text-gray-900">Total to Pay</span>
            <span className="text-2xl font-bold text-craft-900">EGP {cartTotal.toFixed(2)}</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-craft-400' : 'bg-craft-600 hover:bg-craft-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-craft-500 transition`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
