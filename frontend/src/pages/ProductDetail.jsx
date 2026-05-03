import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const fetchProductDetails = () => {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(`http://127.0.0.1:8000/api/products/${id}`, { headers })
      .then(response => {
        setData(response.data);
        setIsFavorited(response.data.is_favorited);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id, token]);

  const toggleFavorite = () => {
    if (!isAuthenticated) return alert('Please login to save products.');
    axios.post(`http://127.0.0.1:8000/api/products/${id}/favorite`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setIsFavorited(res.data.is_favorited);
    }).catch(err => console.error(err));
  };

  const submitReview = (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    axios.post(`http://127.0.0.1:8000/api/products/${id}/reviews`, {
      rating: reviewRating,
      comment: reviewComment
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setReviewModalOpen(false);
      setReviewComment('');
      setReviewRating(5);
      fetchProductDetails(); // Refresh to show new review
    }).catch(err => {
      console.error(err);
      alert(err.response?.data?.message || 'Error submitting review');
    }).finally(() => {
      setSubmittingReview(false);
    });
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-craft-600"></div>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="flex justify-center items-center h-64 w-full text-xl text-gray-500">
        Product not found.
      </div>
    );
  }

  const { product, similar_products, can_review } = data;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Link to="/" className="inline-flex items-center text-craft-600 hover:text-craft-800 font-medium mb-8 transition">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Store
      </Link>

      {/* Product Highlight Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="h-96 md:h-auto bg-gray-100">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-craft-600 tracking-wider uppercase">
                {product.seller?.store_name}
              </span>
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <span className="text-gray-500 text-sm ml-2">(48)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-3xl font-extrabold text-craft-900 mb-6">
              EGP {parseFloat(product.price).toFixed(2)}
            </p>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center space-x-6 mb-8 text-sm text-gray-500 font-medium">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-craft-500" /> Free Shipping
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-craft-500" /> Artisan Guaranteed
              </div>
            </div>

            {product.stock_quantity > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-craft-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-craft-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={toggleFavorite}
                  className={`px-6 py-4 rounded-xl border flex items-center justify-center transition ${isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                  title="Save to Favorites"
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                {product.stock_quantity < 10 && (
                  <div className="flex items-center justify-center px-4 py-3 bg-orange-100 text-orange-800 rounded-xl font-semibold text-sm">
                    Only {product.stock_quantity} left!
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-600 text-center py-4 rounded-xl font-bold text-lg">
                Out of Stock
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews & Feedback</h3>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-3">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 text-gray-300 fill-current" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                {product.reviews && product.reviews.length > 0 
                  ? (product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length).toFixed(1) 
                  : '0.0'} out of 5
              </span>
              <span className="text-gray-500 ml-2">({product.reviews ? product.reviews.length : 0} total ratings)</span>
            </div>
          </div>
          {can_review && (
            <button 
              onClick={() => setReviewModalOpen(true)}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
              Write a Review
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No reviews yet. Be the first to review this handmade treasure!
            </div>
          ) : (
            product.reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-craft-200 text-craft-800 rounded-full flex items-center justify-center font-bold text-lg mr-3">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user?.name}</h4>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex text-yellow-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      onClick={() => setReviewRating(star)}
                      className={`h-8 w-8 ${star <= reviewRating ? 'fill-current' : 'text-gray-300 fill-current'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-craft-500 focus:border-craft-500"
                  rows="4"
                  placeholder="Share your experience with this item..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submittingReview}
                className="w-full bg-craft-600 text-white font-bold py-3 rounded-xl hover:bg-craft-700 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similar_products && similar_products.length > 0 && (
        <div className="border-t border-gray-200 pt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Similar Treasures</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similar_products.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition group overflow-hidden border border-gray-100">
                <Link to={`/product/${item.id}`} onClick={() => window.scrollTo(0, 0)} className="block relative h-48 overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </Link>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 truncate mb-1">
                    <Link to={`/product/${item.id}`} onClick={() => window.scrollTo(0, 0)} className="hover:text-craft-600">
                      {item.name}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">{item.seller?.store_name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-craft-900">EGP {parseFloat(item.price).toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(item);
                      }}
                      className="text-sm font-medium text-craft-600 bg-craft-50 hover:bg-craft-100 px-3 py-1.5 rounded-md transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
