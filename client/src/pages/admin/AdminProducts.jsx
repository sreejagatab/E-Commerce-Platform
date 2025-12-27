import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowLeft,
  FaBox,
  FaSearch,
  FaSync,
  FaFilter,
  FaStar,
  FaInfoCircle
} from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const avgPrice = products.length ? (totalValue / products.length).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <FaArrowLeft className="text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Products Catalog</h1>
              <p className="text-gray-400">{products.length} products in {categories.length - 1} categories</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <FaInfoCircle className="text-blue-400 text-xl mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Product Catalog View</p>
            <p className="text-blue-200/70 text-sm">
              Products are loaded from the system catalog. To add or modify products, update the product data source.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-2xl font-bold text-orange-400">{categories.length - 1}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Avg Price</p>
            <p className="text-2xl font-bold text-green-400">${avgPrice}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-purple-400">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, brand, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-8 text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all group"
            >
              <div className="relative h-48 bg-gray-800">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBox className="text-4xl text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                    {product.category}
                  </span>
                </div>
                {product.rating && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-white text-xs">{product.rating}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2" title={product.description}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold text-lg">${product.price?.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No products found matching your criteria</p>
          </div>
        )}

        {/* Showing count */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
