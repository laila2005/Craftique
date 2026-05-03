import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage user accounts and details</p>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Customers Module Active</h3>
        <p className="mt-1 text-sm text-gray-500">The customer directory and analytics will be displayed here.</p>
      </div>
    </div>
  );
};

export default Customers;
