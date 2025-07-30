import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Filter, Search, X } from 'lucide-react';
import { mockProducts, cashewGrades } from '../data/mockData';
import FloatingPopup from '../components/common/FloatingPopup';
import OAuthLoginModal from '../components/common/OAuthLoginModal';
import { useAuth } from '../contexts/AuthContext';

const Products: React.FC = () => {
  const { user } = useAuth();
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [filters, setFilters] = useState({
    grade: '',
    location: '',
    priceRange: '',
    stockAvailable: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Default sort by name

  const grades = cashewGrades;
  const locations = [...new Set(mockProducts.map(p => p.location))];

  const filteredProducts = mockProducts.filter(product => {
    return (
      (filters.grade === '' || product.grade === filters.grade) &&
      (filters.location === '' || product.location === filters.location) &&
      (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filters.stockAvailable || product.stock > 0)
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerKg - b.pricePerKg;
      case 'price-high':
        return b.pricePerKg - a.pricePerKg;
      case 'stock-high':
        return b.stock - a.stock;
      case 'stock-low':
        return a.stock - b.stock;
      case 'location':
        return a.location.localeCompare(b.location);
      case 'grade':
        return a.grade.localeCompare(b.grade);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleBuyClick = (productId: string) => {
    if (!user) {
      setSelectedProductId(productId);
      setShowLoginModal(true);
      return;
    }
    setSelectedProductId(productId);
    setShowBuyForm(true);
  };

  const clearAllFilters = () => {
    setFilters({
      grade: '',
      location: '',
      priceRange: '',
      stockAvailable: false
    });
    setSearchTerm('');
    setSortBy('name');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.grade) count++;
    if (filters.location) count++;
    if (filters.priceRange) count++;
    if (filters.stockAvailable) count++;
    if (searchTerm) count++;
    if (sortBy !== 'name') count++;
    return count;
  };
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-primary mb-2 sm:mb-4">
            Cashew Products
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Browse our premium selection of cashew kernels across different grades and locations
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base"
            />
          </div>
          
          {/* Sort and Filter */}
          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base bg-white hover:bg-gray-50 min-w-[160px] font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="location">Location A-Z</option>
              <option value="grade">Grade A-Z</option>
            </select>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="relative px-4 py-2.5 sm:py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-lg text-sm font-medium whitespace-nowrap bg-white"
            >
              <span>Filter</span>
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="w-full h-48 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {product.grade}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {product.location}
                  </div>
                </div>
                
                <h3 className="text-base sm:text-lg md:text-xl font-bold font-playfair text-primary mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {product.specifications}
                </p>
                
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-accent">
                      ₹{product.pricePerKg.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-1">per kg</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Stock: {product.stock} tonnes
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Delivery: {product.deliveryTime}
                  </span>
                </div>
                
                <div className="flex space-x-2 text-sm">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 bg-secondary text-primary px-3 py-2 rounded-lg font-medium text-center hover:bg-secondary/80 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleBuyClick(product.id)}
                    className="flex-1 bg-primary text-white px-3 py-2 rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary font-playfair">Filters</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filter Options */}
              <div className="space-y-4">
                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Grade
                  </label>
                  <select
                    value={filters.grade}
                    onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                  >
                    <option value="">All Grades</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                  >
                    <option value="">All Prices</option>
                    <option value="0-75000">Under ₹75,000</option>
                    <option value="75000-85000">₹75,000 - ₹85,000</option>
                    <option value="85000-95000">₹85,000 - ₹95,000</option>
                    <option value="95000+">Above ₹95,000</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.stockAvailable}
                      onChange={(e) => setFilters(prev => ({ ...prev, stockAvailable: e.target.checked }))}
                      className="w-4 h-4 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Show only products in stock</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buy Form */}
      {showBuyForm && (
        <FloatingPopup
          type="buy"
          productId={selectedProductId}
          onClose={() => setShowBuyForm(false)}
        />
      )}

      {/* OAuth Login Modal */}
      {showLoginModal && (
        <OAuthLoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setShowBuyForm(true);
          }}
          title="Sign in to Buy Products"
          subtitle="Please sign in to continue with your purchase"
        />
      )}
    </div>
  );
};

export default Products;