import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Package, Plus, X, Trash2, Check, XCircle } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = () => {
    setLoading(true);
    setProducts([]);
    const endpoint = activeTab === 'active' 
      ? 'http://127.0.0.1:8000/api/products' 
      : 'http://127.0.0.1:8000/api/admin/products/pending';

    axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('stock_quantity', formData.stock_quantity);
    if (formData.image_url) submitData.append('image_url', formData.image_url);
    if (imageFile) submitData.append('image_file', imageFile);

    axios.post('http://127.0.0.1:8000/api/admin/products', submitData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        setProducts([res.data.product, ...products]);
        setIsModalOpen(false);
        setFormData({ name: '', description: '', price: '', stock_quantity: '', image_url: '' });
        setImageFile(null);
      })
      .catch(err => {
        console.error('Error saving product:', err);
        alert('Failed to save product');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios.delete(`http://127.0.0.1:8000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setProducts(products.filter(p => p.id !== productId));
        })
        .catch(err => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product');
        });
    }
  };

  const handleStatusUpdate = (productId, status) => {
    axios.put(`http://127.0.0.1:8000/api/admin/products/${productId}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setProducts(products.filter(p => p.id !== productId));
      })
      .catch(err => {
        console.error('Error updating status:', err);
        alert(err.response?.data?.message || 'Failed to update product status');
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-500 text-sm mt-1 mb-4">Manage catalog and approve seller items</p>
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('active')} 
              className={`py-2 px-4 font-medium border-b-2 text-sm transition ${activeTab === 'active' ? 'border-craft-600 text-craft-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Active Products
            </button>
            <button 
              onClick={() => setActiveTab('pending')} 
              className={`py-2 px-4 font-medium border-b-2 text-sm transition ${activeTab === 'pending' ? 'border-craft-600 text-craft-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Pending Approvals
            </button>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-craft-600 hover:bg-craft-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center mb-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-craft-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No {activeTab} products found.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.image_url} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 w-48 truncate" title={product.description}>{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        EGP {parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.seller?.store_name || 'Craftique'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {activeTab === 'active' ? (
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(product.id, 'approved')}
                              className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition"
                              title="Approve Product"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(product.id, 'rejected')}
                              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                              title="Reject Product"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea required name="description" rows="3" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price (EGP)</label>
                        <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input required type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Image</label>
                      <div className="mt-2 space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload from computer</p>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-craft-100 file:text-craft-700 hover:file:bg-craft-200 cursor-pointer w-full"
                          />
                        </div>
                        <div className="flex items-center py-1">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">Or</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Provide Image URL</p>
                          <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="px-5 py-2.5 bg-craft-600 text-white rounded-lg text-sm font-medium hover:bg-craft-700 transition disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Product'}
                    </button>
                  </div>
                </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
