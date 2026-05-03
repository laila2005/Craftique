import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-craft-900 mb-4">Your Cart is Empty</h2>
        <p className="text-craft-600 mb-8">Looks like you haven't added any handmade treasures yet.</p>
        <Link to="/" className="bg-craft-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-craft-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h2 className="text-3xl font-bold text-craft-900 mb-8 border-b border-craft-200 pb-2">
        Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="py-6 flex flex-col sm:flex-row">
                <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-md overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="ml-0 sm:ml-6 flex-1 flex flex-col mt-4 sm:mt-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">By {item.seller?.store_name}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-gray-900 text-right">EGP {parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex-1 flex items-end justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-craft-600 transition"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 font-medium text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:text-craft-600 transition"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium transition"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 bg-gray-50 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <span>EGP {cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>EGP {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full mt-8 bg-craft-600 text-white flex items-center justify-center px-6 py-3 rounded-lg font-medium hover:bg-craft-700 transition"
          >
            Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
