import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h2 className="text-4xl font-bold text-craft-900 mb-4">Order Placed Successfully!</h2>
      <p className="text-lg text-craft-600 mb-8">
        Thank you for supporting independent artisans. Your handmade goods will be prepared and shipped shortly.
      </p>
      <Link to="/" className="bg-craft-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-craft-700 transition">
        Return to Store
      </Link>
    </div>
  );
};

export default OrderSuccess;
