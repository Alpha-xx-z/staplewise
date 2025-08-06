import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, MessageCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import FloatingPopup from '../components/common/FloatingPopup';
import LoginModal from '../components/common/OAuthLoginModal';
import { useAuth } from '../contexts/AuthContext';
import { ProductService } from '../lib/api';

const ProductDetail: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const products = await ProductService.getAllProducts();
        const foundProduct = products.find((p: any) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get all images for the product
  const getProductImages = () => {
    const images = [];
    
    // Add primary image
    if (product.primaryImage) {
      images.push(product.primaryImage);
    }
    
    // Add additional images if they exist
    if (product.additionalImages) {
      try {
        const additionalImages = JSON.parse(product.additionalImages);
        if (Array.isArray(additionalImages)) {
          images.push(...additionalImages);
        }
      } catch (error) {
        console.error('Error parsing additional images:', error);
      }
    }
    
    // If no images found, use a placeholder
    if (images.length === 0) {
      images.push('https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800');
    }
    
    return images;
  };

  const productImages = getProductImages();

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Gallery */}
            <div className="relative">
              {/* Main Image */}
              <div className="w-full h-80 relative overflow-hidden rounded-lg">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-soft transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-soft transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {productImages.length}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-primary shadow-soft' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details - No changes needed here */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {product.grade}
                </span>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {product.location}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-playfair text-primary mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-accent">
                  ₹{product.pricePerKg.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500 ml-2">per kg</span>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Available Stock</p>
                    <p className="font-semibold">{product.stock} kg</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{product.location}</p>
                  </div>
                </div>
              </div>

              {/* Specifications & Grade */}
              {product.specificationsAndGrade && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold font-playfair text-primary mb-4">
                    Specifications & Grade
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.specificationsAndGrade}
                  </p>
                </div>
              )}

              {/* Basic Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-bold font-playfair text-primary mb-4">
                  Basic Specifications
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.specifications}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    if (!user) {
                      setShowLoginModal(true);
                      return;
                    }
                    setShowBuyForm(true);
                  }}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-accent transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quality Assurance */}
          {product.qualityAssurance && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-xl font-bold font-playfair text-primary mb-4">
                Quality Assurance
              </h3>
              <div className="space-y-2 text-gray-600">
                {product.qualityAssurance.split('\n').map((point: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{point.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packaging & Delivery */}
          {product.packagingAndDelivery && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="text-xl font-bold font-playfair text-primary mb-4">
                Packaging & Delivery
              </h3>
              <div className="space-y-2 text-gray-600">
                {product.packagingAndDelivery.split('\n').map((point: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{point.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Forms */}
      {showBuyForm && (
        <FloatingPopup
          type="buy"
          productId={product.id}
          onClose={() => setShowBuyForm(false)}
        />
      )}
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            setShowBuyForm(true);
          }}
          title="Sign in to Add to Cart"
          subtitle="Please sign in to continue with your purchase"
        />
      )}
      
      {showChat && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-6 max-w-sm z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-primary">Chat with Admin</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Contact our admin team for detailed product information and bulk pricing.
          </p>
          <div className="space-y-2">
            <p className="text-sm"><strong>Email:</strong> admin@staplewise.com</p>
            <p className="text-sm"><strong>Phone:</strong> +91 98765 43210</p>
            <p className="text-sm"><strong>WhatsApp:</strong> +91 98765 43210</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;