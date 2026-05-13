import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Store } from 'lucide-react';

const SellerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/seller/login', formData);
      login(response.data.user || response.data.seller, response.data.token, response.data.role);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto px-4 w-full py-20">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-craft-100 text-craft-600 h-16 w-16 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Seller Login</h2>
          <p className="text-gray-500 mt-2">Access your Craftique store dashboard.</p>
        </div>

        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-craft-600 hover:bg-craft-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-craft-500 transition">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have a store yet? <Link to="/seller/register" className="font-medium text-craft-600 hover:text-craft-500 transition">Open one today</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
