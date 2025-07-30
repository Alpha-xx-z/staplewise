import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProducts, cashewGrades } from '../../data/mockData';

interface FloatingPopupProps {
  type: 'buy' | 'sell';
  productId?: string;
  onClose: () => void;
}

const FloatingPopup: React.FC<FloatingPopupProps> = ({ type, productId, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    productId: productId || '',
    quantity: '',
    companyName: '',
    pincode: '',
    email: '',
    phone: '+91',
    gst: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      alert('Please login to submit a query. Click the Login button in the header.');
      onClose();
      return;
    }
    
    // Handle form submission
    console.log('Form submitted:', { type, ...formData });
    // In a real app, this would send to an API
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} query submitted successfully!`);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div className="bg-white rounded-xl shadow-2xl border border-accent/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-primary text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">
              {type === 'buy' ? 'Buy Cashews' : 'Sell Cashews'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Product Category
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            >
              <option value="">Choose grade...</option>
              {type === 'sell' ? (
                cashewGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))
              ) : (
                mockProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.location}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Quantity (Tonnes)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          {type === 'sell' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company GST
              </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                required
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-accent focus:border-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent to-primary text-white py-2 px-4 rounded text-sm font-medium hover:from-accent/90 hover:to-primary/90 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Submit {type === 'buy' ? 'Buy' : 'Sell'} Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloatingPopup;