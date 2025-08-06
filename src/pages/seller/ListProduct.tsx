import React, { useState, useEffect } from 'react';
import { Plus, Package, MapPin, DollarSign, Upload, X, Loader2, Edit, Trash2 } from 'lucide-react';
import { ApiClient } from '../../lib/apiClient';
import { useAuth } from '../../contexts/AuthContext';

interface ProductListing {
  id: string;
  name: string;
  category: string;
  grade: string;
  pricePerKg: number;
  minimumOrderQuantity: number;
  location: string;
  primaryImage: string;
  additionalImages?: string;
  specificationsAndGrade?: string;
  qualityAssurance?: string;
  packagingAndDelivery?: string;
  createdAt: string;
  seller?: {
    id: string;
    name: string;
    companyName?: string;
  };
}

const ListProduct: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductListing | null>(null);
  const [products, setProducts] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    grade: '',
    costPerKg: '',
    minimumOrderQuantity: '',
    location: '', // Will be auto-filled from company details
    specificationsAndGrade: '',
    qualityAssurance: '',
    packagingAndDelivery: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Category and grade mapping
  const categoryGrades = {
    cashews: ['W180', 'W210', 'W240', 'W320', 'W400', 'A180', 'A210', 'A240', 'A320', 'A400', 'JK0', 'K00', 'LWP', 'S00 (JH)', 'SK0', 'SSW(WW320)', 'SSW1(W300)', 'SWP', 'BB0', 'BB1', 'BB2', 'DP0', 'DP1', 'DP2'],
    cloves: ['Whole Cloves', 'Ground Cloves', 'Clove Buds', 'Premium Grade', 'Standard Grade', 'Commercial Grade'],
    chillies: ['Kashmiri Red', 'Guntur Red', 'Byadgi Red', 'Teja Red', 'Green Chilli', 'Dried Red', 'Powder Grade', 'Whole Dried'],
    'star-anise': ['Whole Star', 'Broken Star', 'Ground Star', 'Premium Grade', 'Standard Grade', 'Commercial Grade'],
    pepper: ['Black Pepper Whole', 'White Pepper Whole', 'Black Pepper Powder', 'White Pepper Powder', 'Green Pepper', 'Pink Pepper'],
    cinnamon: ['Ceylon Cinnamon', 'Cassia Cinnamon', 'Cinnamon Sticks', 'Cinnamon Powder', 'Broken Cinnamon', 'Quillings']
  };

  const categories = [
    { id: 'cashews', name: 'Cashews' },
    { id: 'cloves', name: 'Cloves' },
    { id: 'chillies', name: 'Chillies' },
    { id: 'star-anise', name: 'Star Anise' },
    { id: 'pepper', name: 'Pepper' },
    { id: 'cinnamon', name: 'Cinnamon' }
  ];

  // Check authentication and role
  useEffect(() => {
    if (!user) {
      alert('Please login to access this page');
      window.location.href = '/login';
      return;
    }
    
    if (user.role !== 'SELLER') {
      alert('Access denied. Only sellers can access this page.');
      window.location.href = '/';
      return;
    }
  }, [user]);

  // Load products and company details on component mount
  useEffect(() => {
    if (user && user.role === 'SELLER') {
      loadProducts();
      loadCompanyDetails();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getSellerProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyDetails = async () => {
    try {
      setLocationLoading(true);
      const data = await ApiClient.getCompanyDetails();
      if (data.success && data.companyDetails) {
        const { city, address } = data.companyDetails;
        const state = address?.state;
        if (city && state) {
          setFormData(prev => ({
            ...prev,
            location: `${city}, ${state}`
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load company details:', error);
      // Don't show alert for this as it's not critical
    } finally {
      setLocationLoading(false);
    }
  };

  const handleEditProduct = (product: ProductListing) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category.toLowerCase().replace('_', '-'),
      grade: product.grade,
      costPerKg: product.pricePerKg.toString(),
      minimumOrderQuantity: product.minimumOrderQuantity.toString(),
      location: product.location,
      specificationsAndGrade: product.specificationsAndGrade || '',
      qualityAssurance: product.qualityAssurance || '',
      packagingAndDelivery: product.packagingAndDelivery || ''
    });
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProduct(productId);
      await ApiClient.deleteProduct(productId);
      await loadProducts(); // Reload products after deletion
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset grade when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        grade: '' // Reset grade selection
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > 3) {
      alert('You can upload maximum 3 images');
      return;
    }
    
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      grade: '',
      costPerKg: '',
      minimumOrderQuantity: '',
      location: formData.location, // Keep the current location from company details
      specificationsAndGrade: '',
      qualityAssurance: '',
      packagingAndDelivery: ''
    });
    
    // Clean up image URLs
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0 && !editingProduct) {
      alert('Please upload at least one product image');
      return;
    }
    
    try {
      setSubmitting(true);
      
      let primaryImage = editingProduct?.primaryImage || '';
      let additionalImages = editingProduct?.additionalImages || null;
      
      // Upload new images if any
      if (selectedImages.length > 0) {
        const imageUrls = [];
        for (const file of selectedImages) {
          const imageUrl = await ApiClient.uploadImage(file);
          imageUrls.push(imageUrl);
        }
        
        primaryImage = imageUrls[0];
        additionalImages = imageUrls.slice(1).length > 0 ? JSON.stringify(imageUrls.slice(1)) : null;
      }
      
      // Prepare product data
      const productData = {
        name: formData.name,
        category: formData.category.toUpperCase().replace('-', '_'),
        grade: formData.grade,
        pricePerKg: parseFloat(formData.costPerKg),
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        description: `${formData.name} - ${formData.grade} grade`,
        specifications: `Grade: ${formData.grade}, Category: ${formData.category}`,
        specificationsAndGrade: formData.specificationsAndGrade,
        qualityAssurance: formData.qualityAssurance,
        packagingAndDelivery: formData.packagingAndDelivery,
        deliveryTime: '3-5 business days',
        packagingType: 'Standard packaging',
        primaryImage,
        additionalImages,
        location: formData.location
      };
      
      if (editingProduct) {
        // Update existing product
        await ApiClient.updateProduct(editingProduct.id, productData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await ApiClient.createProduct(productData);
        alert('Product listed successfully!');
      }
      
      // Reload products
      await loadProducts();
      
      resetForm();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-playfair text-primary">List Product</h1>
          <p className="text-gray-600 mt-2">Add your cashew products to the marketplace</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-xl font-bold font-playfair text-primary mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g., Premium Cashew Kernels"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.category}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="">{!formData.category ? 'Select Category First' : 'Select Grade'}</option>
                  {formData.category && categoryGrades[formData.category as keyof typeof categoryGrades]?.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per KG (₹) *
                </label>
                <input
                  type="number"
                  name="costPerKg"
                  value={formData.costPerKg}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g., 850"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Quantity (KG) *
                </label>
                <input
                  type="number"
                  name="minimumOrderQuantity"
                  value={formData.minimumOrderQuantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="e.g., 100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={locationLoading ? 'Loading...' : formData.location}
                  onChange={handleInputChange}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  placeholder="Auto-filled from company details"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {locationLoading ? 'Loading location from company details...' : 'Location is auto-filled from your company registration details'}
                </p>
              </div>

              {/* Specifications & Grade */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications & Grade Description
                </label>
                <textarea
                  name="specificationsAndGrade"
                  value={formData.specificationsAndGrade}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Provide a small description about the specifications and grade of your product..."
                />
              </div>

              {/* Quality Assurance */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Assurance (Up to 5 points)
                </label>
                <textarea
                  name="qualityAssurance"
                  value={formData.qualityAssurance}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="List up to 5 quality assurance points (e.g., 1. ISO certified, 2. HACCP compliant, 3. Regular quality checks, 4. Premium grade selection, 5. Food safety standards)..."
                />
              </div>

              {/* Packaging & Delivery */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Packaging & Delivery (Up to 5 points)
                </label>
                <textarea
                  name="packagingAndDelivery"
                  value={formData.packagingAndDelivery}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="List up to 5 packaging and delivery points (e.g., 1. Vacuum sealed packaging, 2. Express delivery available, 3. Bulk packaging options, 4. Temperature controlled shipping, 5. Insurance coverage)..."
                />
              </div>

              {/* Image Upload Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images * (Maximum 3 images)
                </label>
                
                {/* Upload Button */}
                {selectedImages.length < 3 && (
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> product images
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB each)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
                
                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {editingProduct ? 'Updating Product...' : 'Creating Product...'}
                  </>
                ) : (
                  editingProduct ? 'Update Product' : 'List Product'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold font-playfair text-primary">Your Listed Products</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-primary mr-3">
                        {product.name}
                      </h3>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {product.grade}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm">Price per KG</p>
                          <p className="font-semibold text-primary">₹{product.pricePerKg}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm">Min. Order</p>
                          <p className="font-semibold">{product.minimumOrderQuantity} KG</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm">City</p>
                          <p className="font-semibold">{product.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Show only minimum details - removed detailed specifications */}
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">
                      Listed on {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      {(product.specificationsAndGrade || product.qualityAssurance || product.packagingAndDelivery) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Detailed
                        </span>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingProduct === product.id}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingProduct === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No products listed yet</p>
            <p className="text-gray-400 mb-6">Add your first product to start selling on StapleWise</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListProduct;