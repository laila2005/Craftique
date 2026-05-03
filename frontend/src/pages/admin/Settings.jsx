import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your marketplace preferences</p>
        </div>
        <button className="bg-craft-600 hover:bg-craft-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Save Changes
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-12 text-center">
        <SettingsIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Settings Module Active</h3>
        <p className="mt-1 text-sm text-gray-500">Global configuration options will be managed from this panel.</p>
      </div>
    </div>
  );
};

export default Settings;
