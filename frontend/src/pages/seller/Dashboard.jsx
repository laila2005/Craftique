import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Package, Plus, X, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageStock, setManageStock] = useState('');
  const [manageLoading, setManageLoading] = useState(false);
  const { token, user } = useContext(AuthContext);

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
  }, []);

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/seller/products', {
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

    axios.post('http://127.0.0.1:8000/api/seller/products', submitData, {
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
        alert('Product submitted for approval!');
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
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      axios.delete(`http://127.0.0.1:8000/api/seller/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setProducts(products.filter(p => p.id !== productId));
        })
        .catch(err => {
          console.error('Error deleting product:', err);
          alert(err.response?.data?.message || 'Failed to delete product');
        });
    }
  };

  const openManageModal = (product) => {
    setManageLoading(true);
    setSelectedProduct(product);
    setManageStock(product.stock_quantity);
    setIsManageModalOpen(true);
    
    axios.get(`http://127.0.0.1:8000/api/seller/products/${product.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSelectedProduct(res.data);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
      })
      .finally(() => {
        setManageLoading(false);
      });
  };

  const handleStockUpdate = (e) => {
    e.preventDefault();
    setManageLoading(true);
    axios.put(`http://127.0.0.1:8000/api/seller/products/${selectedProduct.id}`, {
      stock_quantity: manageStock
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock_quantity: manageStock } : p));
        alert('Stock updated successfully!');
      })
      .catch(err => {
        console.error('Error updating stock:', err);
        alert(err.response?.data?.message || 'Failed to update stock');
      })
      .finally(() => {
        setManageLoading(false);
      });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold"><CheckCircle className="w-3 h-3 mr-1"/> Live</span>;
      case 'rejected': return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>;
      default: return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-semibold"><Clock className="w-3 h-3 mr-1"/> Pending Review</span>;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.store_name || 'My Store'} Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your inventory and submit new handmade goods for approval.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-craft-600 hover:bg-craft-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit New Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-craft-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">You haven't submitted any products yet.</p>
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        EGP {parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openManageModal(product)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition text-xs font-semibold"
                          >
                            Manage
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Submit New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm">
                <strong>Note:</strong> All new products require approval from a Craftique admin before they appear on the public storefront.
              </div>
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
                        <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                        <input required type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 py-2 px-3 border" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Image</label>
                      <div className="mt-2 space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Upload File</p>
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
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Image URL</p>
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
                      {saving ? 'Submitting...' : 'Submit for Review'}
                    </button>
                  </div>
                </form>
          </div>
        </div>
      )}

      {/* Manage Product Modal */}
      {isManageModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsManageModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all flex flex-col">
            <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Manage Product: {selectedProduct.name}</h3>
              <button onClick={() => setIsManageModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full aspect-square object-cover rounded-xl shadow-sm mb-4" />
                <div className="mb-4">{getStatusBadge(selectedProduct.status)}</div>
                <p className="text-xl font-bold text-gray-900 mb-1">EGP {parseFloat(selectedProduct.price).toFixed(2)}</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Inventory</h4>
                  <form onSubmit={handleStockUpdate} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Stock Quantity</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={manageStock} 
                        onChange={(e) => setManageStock(e.target.value)} 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-craft-500 focus:ring-craft-500 sm:text-sm px-3 py-2 border bg-white" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={manageLoading || manageStock == selectedProduct.stock_quantity} 
                      className="w-full px-4 py-2 bg-craft-600 text-white rounded-md text-sm font-medium hover:bg-craft-700 transition disabled:opacity-50"
                    >
                      {manageLoading ? 'Updating...' : 'Update Stock'}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm mb-8 whitespace-pre-line">{selectedProduct.description}</p>
                
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Customer Reviews</h4>
                  {manageLoading && !selectedProduct.reviews ? (
                    <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-craft-600"></div></div>
                  ) : selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {selectedProduct.reviews.map(review => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm text-gray-900">{review.user?.name || 'Customer'}</span>
                            <div className="flex items-center text-yellow-400 text-sm">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No reviews yet for this product.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
