import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password
      });

      login(response.data.user, response.data.token, response.data.role);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 422) {
        // Simple error handling for validation
        const validationErrors = err.response.data.errors;
        const firstError = Object.values(validationErrors)[0][0];
        setError(firstError);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-craft-900 mb-8 tracking-tight">Create an Account</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-craft-500 focus:ring-1 focus:ring-craft-500 transition"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-craft-500 focus:ring-1 focus:ring-craft-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-craft-500 focus:ring-1 focus:ring-craft-500 transition"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading ? 'bg-craft-400' : 'bg-craft-600 hover:bg-craft-700'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-craft-600 font-semibold hover:text-craft-800 transition">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
