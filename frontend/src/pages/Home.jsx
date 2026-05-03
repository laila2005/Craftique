import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-craft-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Discover Unique Handmade Treasures
          </h1>
          <p className="text-xl md:text-2xl text-craft-200 max-w-3xl mx-auto">
            Support independent artisans and find one-of-a-kind pieces for your home and lifestyle.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h2 className="text-3xl font-bold text-craft-900 mb-8 border-b border-craft-200 pb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Artisans'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-craft-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.seller?.store_name?.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
                <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock_quantity < 10 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Only {product.stock_quantity} left
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      <Link to={`/product/${product.id}`} className="hover:text-craft-600">
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm text-craft-600 mb-3 flex items-center">
                    By {product.seller?.store_name || 'Unknown Artisan'}
                  </p>
                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">(12)</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-craft-900">EGP {parseFloat(product.price).toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className="bg-craft-100 text-craft-800 hover:bg-craft-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {products.filter(p => 
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.seller?.store_name?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-500">No products found matching your search.</p>
                <Link to="/" className="mt-4 inline-block text-craft-600 font-medium hover:underline">Clear Search</Link>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
